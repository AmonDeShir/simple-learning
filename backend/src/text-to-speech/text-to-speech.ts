import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { DikiScraper } from '../scrapers/diki.scraper';
import { Language } from '../types/languages.type';

export namespace TextToSpeech {
  const client = new TextToSpeechClient();

  export async function generate(text: string, language: Language){
    if (text.trim().length === 0) {
      return undefined;
    }

    if (language === "English") {
      const audioFromDiki = await DikiScraper.getAudio(text);

      if (audioFromDiki) {
        return audioFromDiki;
      }
    }

    const audio = await synthesizeSpeech(text, languageToLangCode(language));

    if (audio) {
      return audio;
    }
  
    return undefined;
  }

  function languageToLangCode(language: Language): string {
    switch (language) {
      case "English": return "en-US";
      case "Polish": return "pl-PL";
      case "Interslavic": return "sr-RS";
      default: return "en-US"
    }
  }

  async function synthesizeSpeech(text: string, languageCode: string) {
    let response: { audioContent?: Uint8Array | string | null } | undefined = undefined;

    const request = {
      input: { text: text.trim() },
      voice: { languageCode, ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    } as any;

    try {
      response = (await client.synthesizeSpeech(request))[0];
    } catch (e) {
      console.log("error: ", e);
    }

    return toBase64(response?.audioContent);
  }

  function toBase64(data?: Uint8Array | string | null) {
    if (typeof data === 'string' || !data) {
      return undefined;
    }
    else {
      return `data:audio/mp3;base64,` + Buffer.from(data.buffer).toString('base64');
    }
  }
}