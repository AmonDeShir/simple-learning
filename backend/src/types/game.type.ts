import { Language } from "./languages.type";

export type WordData = {
  id: string,
  word: string,
  meaning: string,
  audio?: string;
  firstExample?: {
    example: string;
    translation: string;
    audio?: string;
  },
  secondExample?: {
    example: string;
    translation: string;
    audio?: string;
  },
}

export type SetData = {
  id: string;
  title: string;
  words: WordData[];
}

export const GameModes = {
  'flashcards': true,
  'writing': true,
  'speller': true,
  'mix': true,
} as const;

export type GameType = keyof typeof GameModes;

export type GameItem = {
  id: string;
  wordId?: string;
  audio?: string;
  text: string;
  translation: string;
  invert: boolean;
  language: Language;
  mode: 'flashcard' | 'writing' | 'speller' | 'information';
}

export type GameItemWithExamples = {
  id: string;
  wordId?: string;
  audio?: string;
  text: string;
  translation: string;
  invert: boolean;
  language: Language;
  mode: 'flashcard' | 'writing' | 'speller' | 'information';
  examples: GameItem[]
}


export type LoadResult = SetData & { mode: GameType, id: string };

export type GameResponse = {
  mode: GameType;
  id: string;
  items: GameItem[];
  languages: Language[],
}
