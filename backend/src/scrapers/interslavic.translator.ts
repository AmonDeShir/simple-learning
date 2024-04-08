import { translationEnModel, translationIsvModel, TranslationModel, translationPlModel, wordListModel } from '../models/translation.model';
import { Language } from '../types/languages.type';
import { SearchResult } from '../types/search.type';

const SupportedLanguages = ['Polish', 'English', 'Interslavic'];

export namespace InterslavicTranslator {
  export async function translate(word: string, from?: Language, to?: Language): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    
    if ((from && !SupportedLanguages.includes(from)) || (to && !SupportedLanguages.includes(to))) {
      return [];
    }

    word = cyrillicToLatin(word);

    if (!from && !to) {
      results.push(...(await translateFrom(word, "Polish", "Interslavic")));
      results.push(...(await translateFrom(word, "English", "Interslavic")));
      results.push(...(await translateFrom(word, "Interslavic", "Polish")));
    }
    
    else if (from && to) {
      results.push(...(await translateFrom(word, from, to)));
    }
    
    else if (!to && from) {
      if (from !== "Interslavic") {
        results.push(...(await translateFrom(word, from, "Interslavic")));
      }
      else {
        results.push(...(await translateFrom(word, 'Interslavic', "Polish")));
        results.push(...(await translateFrom(word, 'Interslavic', "English")));
      }
    }

    else if (!from && to) {
      if (to !== "Interslavic") {
        results.push(...(await translateFrom(word, "Interslavic", to)));
      }
      else {
        results.push(...(await translateFrom(word, "English", "Interslavic")));
        results.push(...(await translateFrom(word, "Polish", "Interslavic")));
      }
    }

    return results;
  }
  
  const interslavicCyrillic = {
    'а': 'a',
    'б': 'b',
    'ц': 'c',
    'ч': 'č',
    'д': 'd',
    'дж': 'dž',
    'е': 'e',
    'є': 'ě',
    'ф': 'f',
    'г': 'g',
    'х': 'h',
    'и': 'i',
    'ј': 'j',
    'к': 'k',
    'л': 'l',
    'љ': 'lj',
    'м': 'm',
    'н': 'n',
    'њ': 'nj',
    'о': 'o',
    'п': 'p',
    'р': 'r',
    'с': 's',
    'ш': 'š',
    'т': 't',
    'у': 'u',
    'в': 'v',
    'ы': 'y',
    'з': 'z',
    'ж': 'ž',
  };

  const etymologicalCharacters = {
    'ę': 'e',
    'ų': 'u',
    'å': 'a',
    'ė': 'e',
    'ȯ': 'o',
    'ć': 'č',
    'đ': 'dž',
    'ľ': 'lj',
    'ĺ': 'lj',
    'ń': 'nj',
    'ŕ': 'r',
    't́': 't',
    'd́': 'd',
    'ś': 's',
    'ź': 'z',
  };

  function cyrillicToLatin(word: string) {
    return [...word].map(letter => interslavicCyrillic[letter] ?? letter).join('');
  }

  function removeEtymologicalLetters(word: string) {
    return [...word].map(letter => etymologicalCharacters[letter] ?? letter).join('');
  }

  async function translateFrom(word: string, from: Language, to: Language): Promise<SearchResult[]> {
    const text = word.toLowerCase().trim();
    const resultId: string[] = [];

    if (from !== 'Interslavic' && to !== 'Interslavic') {
      return [];
    }

    switch(from) {
      case "Interslavic":
        resultId.push(...(await findIds(translationIsvModel, text)));
        break;

      case "English":
        resultId.push(...(await findIds(translationEnModel, text)));
        break;

      case "Polish":
        resultId.push(...(await findIds(translationPlModel, text)));
        break;

      default:
        return [];
    };

    return (await Promise.all(resultId.map(findResult(from, to)))).flatMap(data => data);
  }

  async function findIds(model: TranslationModel, text: string) {
    const translations = await model.find({ translations: text });
  
    return translations.map(({ wordId }) => wordId);
  }

  function findResult(from: "Polish" | "Interslavic" | "English", to: "Polish" | "Interslavic" | "English"): (target: string) => Promise<SearchResult[]> {
    return async (targetId: string) => {
      let word = await wordListModel.findById(targetId);

      if (!word) {
        return [];
      }

      const [isv, addition, partOfSpeech, en, ru, be, uk, pl, cs, sk, bg, mk, sr, hr, sl] = word.data;
      
      return [{
        word: removeEtymologicalLetters(isv),
        meaning: ({ "Polish": pl, "Interslavic": removeEtymologicalLetters(isv), "English": en }[from === "Interslavic" ? to : from ]),
        language: "Interslavic",
        audio: null,
        info: {
          addition,
          partOfSpeech,
          lang: { 
            en: en.replaceAll('!', ''),
            ru: ru.replaceAll('!', ''),
            be: be.replaceAll('!', ''),
            uk: uk.replaceAll('!', ''),
            pl: pl.replaceAll('!', ''),
            cs: cs.replaceAll('!', ''),
            sk: sk.replaceAll('!', ''),
            bg: bg.replaceAll('!', ''),
            mk: mk.replaceAll('!', ''),
            sr: sr.replaceAll('!', ''),
            hr: hr.replaceAll('!', ''),
            sl: sl.replaceAll('!', ''),
          }
        },
      }]
    }
  }
}