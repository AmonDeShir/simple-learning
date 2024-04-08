import { Language } from "./languages.type";

export type SearchResult = {
  word: string;
  meaning: string;
  audio: string | null;
  language: Language,
  info?: {
    addition: string,
    partOfSpeech: string,
    lang: {
      en: string, 
      ru: string, 
      be: string, 
      uk: string, 
      pl: string, 
      cs: string, 
      sk: string, 
      bg: string, 
      mk: string, 
      sr: string, 
      hr: string, 
      sl: string,
    }
  },
  firstExample?: SearchExample,
  secondExample?: SearchExample
}

export type SearchExample = {
  example: string;
  translation: string;
  audio: string | null;
}