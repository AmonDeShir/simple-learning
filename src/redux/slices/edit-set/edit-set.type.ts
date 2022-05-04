
export type WordData = {
  type: 'create' | 'edit' | 'import',
  id: string,
  word: string,
  meaning: string,
  error: ErrorWord
  firstExample?: {
    example: string;
    translation: string;
  },
  secondExample?: {
    example: string;
    translation: string;
  },
  usedIn?: {
    id: string,
    title: string,
  }[],
}

export type ErrorWord = {
  word?: string;
  meaning?: string;
  firstExample?: string;
  firstExampleTranslation?: string;
  secondExample?: string;
  secondExampleTranslation?: string;
}

export const requiredFields = ['word', 'meaning'] as const;

export type WordDataConstructor = Omit<WordData, 'id'> & { id?: string }

export type SetData = {
  id: string;
  title: string;
  words: WordData[];
}