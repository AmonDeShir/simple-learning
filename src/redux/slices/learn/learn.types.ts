import { SuperMemoOutput } from "../../../super-memo/super-memo.types";

export type LearnItem = {
  id: string;
  wordId?: string;
  audio?: string;
  text: string;
  translation: string;
  invert: boolean;
  progress: SuperMemoOutput;
  set: string;
  inGameId: string;
  mode: 'flashcard' | 'writing' | 'information';
}

export type LoadResult = Omit<LearnItem, "inGameId">[];