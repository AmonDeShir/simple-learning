import axios, { AxiosResponse } from 'axios';
import JSSoup, { SoupTag } from 'jssoup';
import https from 'https';
import { SearchResult } from '../types/search.type';
import { Language } from '../types/languages.type';
import { SearchExample } from '../types/search.type';

export namespace DikiScraper {
  function request(url: string): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
      const req = https.request(url, (res) => {
        resolve(res.statusCode);
      });
      
      req.on('error', () => {
        resolve(undefined); 
      });

      req.end();
    })
  }

  export async function getAudio(word: string): Promise<string | null> {
    const languages = [ 'en', 'en-ame'];
    const fixedWord = word
      .trim()
      .toLowerCase()
      .replace(/[\'\*\."\[\]:;|,<>\\\/\n]/g, '')
      .replace(/ /g, '_');

    const urls = languages.map((language) => `https://www.diki.pl/images-common/${language}/mp3/${fixedWord}.mp3`);
    
    return getAudioFromLinks(...urls);
  }

  export async function getAudioFromLinks(...urls: string[]): Promise<string | null> {
    const results = await Promise.all(urls.map(async (url) => ({
      status: (await request(url)) || 404,
      url: url
    })));
    
    const link = results.filter(({ status }) => status === 200)[0]?.url ?? null;

    if (link) {
      return await toBase64(link);
    }

    return null;
  }

  async function toBase64(url:string) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });

      if (response.headers["content-type"] === 'text/html; charset=UTF-8') {
        return null;
      }
      
      return "data:" + response.headers["content-type"] + ";base64," + Buffer.from(response.data).toString('base64');
    } catch {}

    return null;
  }

  const SupportedLanguages = ['Polish', 'English'];

  export async function search(word: string, from?: Language, to: Language = "Polish") {
    let response: AxiosResponse<any, any> | undefined = undefined;
    
    if ((from && !SupportedLanguages.includes(from)) || (to && !SupportedLanguages.includes(to))) {
      return [];
    }

    try {
      response = await axios.get(`http://www.diki.pl/${encodeURI(word)}`);
    }
    catch {}

    if (!response || response.status !== 200 || !response.data) {
      return [];
    }

    const soup = new JSSoup(await response.data);
    const jssResults = soup.findAll<SoupTag>('div', 'diki-results-container');

    const results = await Promise
      .all(jssResults.map((soup) => parseResultContainer(soup, from)))
      .then((results) => results.flatMap(result => result));

    return results.filter(filterDuplicates).map(changeLanguageTo(to));
  }

  function changeLanguageTo(to: Language) {
    return (value: SearchResult) => {
      if (to === 'English') {
        return {
          ...value,
          language: "Polish" as const,
          word: value.meaning,
          meaning: value.word,

          firstExample: value.firstExample ? {
            example: value.firstExample.translation,
            translation: value.firstExample.example,
          } : undefined,

          secondExample: value.secondExample ? {
            example: value.secondExample.translation,
            translation: value.secondExample.example,
          } : undefined,
        } as SearchResult;
      };

      return value;
    }
  }

  function filterDuplicates(value: SearchResult, index: number, array: SearchResult[]) {
    const previous = array[index - 1];

    if (!previous) {
      return true;
    }

    if (previous.meaning == `${value.word}, ${value.meaning}`) {
      return false;
    }

    if (value.audio && (value.audio === previous.firstExample?.audio || value.audio === previous.secondExample?.audio)) {
      return false;
    }

    return true;
  }

  async function parseResultContainer(soup: SoupTag, from?: Language) {
    const results: SearchResult[] = [];

    if (from !== 'Polish' && soup.findAll<SoupTag>('ol', 'foreignToNativeMeanings').length > 0) {
      for (const entity of soup.findAll<SoupTag>('div', 'dictionaryEntity')) {
        const parsed = await parseForeignDictionaryEntity(entity);
        parsed && results.push(...parsed);
      }
    }

    if (from !== 'English' && soup.findAll<SoupTag>('ol', 'nativeToForeignEntrySlices').length > 0) {
      for (const entity of soup.findAll<SoupTag>('div', 'dictionaryEntity')) {
        const parsed = await parseNativeDictionaryEntity(entity);
        parsed && results.push(...parsed);
      }
    }

    return results;
  }

  async function parseForeignDictionaryEntity(soup: SoupTag): Promise<SearchResult[]> {
    const hws = soup.find<SoupTag>('div', 'hws');
    const spanWithWord = soup.find<SoupTag>('span', 'hw');
    const meanings: { meaning: string, firstExample: SearchExample, secondExample: SearchExample }[] = [];

    for (const foreignToNativeMeaning of soup.findAll<SoupTag>(
      'ol',
      'foreignToNativeMeanings',
    )) {
      for (const meaning of foreignToNativeMeaning.findAll<SoupTag>('li')) {
        const parsed = await parseMeaning(meaning);
        parsed && meanings.push(parsed);
      }
    }

    if (!hws || !spanWithWord) {
      return [];
    }

    const wordData = {
      word: spanWithWord.text
        .replaceAll('  ', '')
        .replaceAll('\r\n', '')
        .replaceAll('\n', '')
        .replaceAll('&apos;', `'`)
        .replaceAll('&quot;', `"`)
        .replaceAll('.)', '.')
        .replaceAll('!)', '!')
        .replaceAll('?)', '?')
        .replaceAll(';)', ';'),

      audio: (
        `https://www.diki.pl${hws?.find<SoupTag>('span', 'audioIcon')?.attrs['data-audio-url'] || ''}`
      ),
    }

    return meanings.map(({ meaning, ...examples }) => ({
      ...wordData,
      ...examples,
      meaning,
      language: "English",
    }));
  }

  async function parseMeaning(meaning: SoupTag) {
    const examples: SearchExample[] = [];
    const span = meaning.find<SoupTag>('span', 'hw');
    const link = span?.find<SoupTag>('a');

    if (!span || !link) {
      return null;
    }

    for (const example of meaning.findAll<SoupTag>('div', 'exampleSentence')) {
      examples.push({
        example: example.text
          .split('(')[0]
          .replaceAll('  ', '')
          .replaceAll('\r\n', '')
          .replaceAll('\n', '')
          .replaceAll('&apos;', `'`)
          .replaceAll('&quot;', `"`)
          .replaceAll('.)', '.')
          .replaceAll('!)', '!')
          .replaceAll('?)', '?')
          .replaceAll(';)', ';'),

        translation: example.text
          .split('(')[1]
          .replaceAll('  ', '')
          .replaceAll('\r\n', '')
          .replaceAll('\n', '')
          .replaceAll('&apos;', `'`)
          .replaceAll('&quot;', `"`)
          .replaceAll('.)', '.')
          .replaceAll('!)', '!')
          .replaceAll('?)', '?')
          .replaceAll(';)', ';'),

        audio: (`https://www.diki.pl${
          example.find<SoupTag>('span', 'audioIcon')?.attrs['data-audio-url'] ||
          ''
        }`),
      });
    }

    return {
      meaning: link.text
        .replaceAll('  ', '')
        .replaceAll('\r\n', '')
        .replaceAll('\n', '')
        .replaceAll('&apos;', `'`)
        .replaceAll('&quot;', `"`)
        .replaceAll('.)', '.')
        .replaceAll('!)', '!')
        .replaceAll('?)', '?')
        .replaceAll(';)', ';'),

      firstExample: examples[0],
      secondExample: examples[1],
    };
  }

  async function parseNativeDictionaryEntity(soup: SoupTag) {
    const spanWithTranslation = soup.find<SoupTag>('span', 'hw');
    const results: SearchResult[] = [];

    if (!spanWithTranslation) {
      return null;
    }

    const translation = spanWithTranslation.text
      .replaceAll('  ', '')
      .replaceAll('\r\n', '')
      .replaceAll('\n', '')
      .replaceAll('&apos;', `'`)
      .replaceAll('&quot;', `"`)
      .replaceAll('.)', '.')
      .replaceAll('!)', '!')
      .replaceAll('?)', '?')
      .replaceAll(';)', ';');

    for (const nativeToForeignMeaning of soup.findAll<SoupTag>(
      'ol',
      'nativeToForeignEntrySlices',
    )) {
      for (const meaning of nativeToForeignMeaning.findAll<SoupTag>('li')) {
        const audioSpan = meaning.find<SoupTag>(
          'span',
          'recordingsAndTranscriptions',
        );

        const audio = (`https://www.diki.pl${
          audioSpan?.find<SoupTag>('span', 'audioIcon')?.attrs[
            'data-audio-url'
          ] || ''
        }`);

        const hw = meaning.find<SoupTag>('span', 'hw');
        const wordLink = hw?.find<SoupTag>('a');
        const word = wordLink?.text
          .replaceAll('  ', '')
          .replaceAll('\r\n', '')
          .replaceAll('\n', '')
          .replaceAll('&apos;', `'`)
          .replaceAll('&quot;', `"`)
          .replaceAll('.)', '.')
          .replaceAll('!)', '!')
          .replaceAll('?)', '?')
          .replaceAll(';)', ';');

        if (!word) {
          continue;
        }

        const nativeToForeignMeanings = meaning.find<SoupTag>(
          'ul',
          'nativeToForeignMeanings',
        );

        const betterTranslation = nativeToForeignMeanings
          ?.findAll<SoupTag>('span', 'hw')
          .flatMap((item) => {
            const items = item.findAll<SoupTag>('a').map(({ text }) => text);
            return items.length === 0 ? item.text : items;
          })
          .join(', ');

        const examples: SearchExample[] = [];

        for (const example of meaning.findAll<SoupTag>(
          'div',
          'exampleSentence',
        )) {
          examples.push({
            example: example.text
              .split('(')[0]
              .replaceAll('  ', '')
              .replaceAll('\r\n', '')
              .replaceAll('\n', '')
              .replaceAll('&apos;', `'`)
              .replaceAll('&quot;', `"`)
              .replaceAll('.)', '.')
              .replaceAll('!)', '!')
              .replaceAll('?)', '?')
              .replaceAll(';)', ';'),

            translation: example.text
              .split('(')[1]
              .replaceAll('  ', '')
              .replaceAll('\r\n', '')
              .replaceAll('\n', '')
              .replaceAll('&apos;', `'`)
              .replaceAll('&quot;', `"`)
              .replaceAll('.)', '.')
              .replaceAll('!)', '!')
              .replaceAll('?)', '?')
              .replaceAll(';)', ';'),

            audio: (`https://www.diki.pl${
              example.find<SoupTag>('span', 'audioIcon')?.attrs[
                'data-audio-url'
              ] || ''
            }`),
          });
        }

        results.push({
          word: word,
          language: "English",
          audio: audio,
          meaning: betterTranslation || translation,
          firstExample: examples[0],
          secondExample: examples[1],
        });
      }
    }

    return results;
  }
} 