import { SuperMemoOutput } from "../../../super-memo/super-memo.types";
import { Language } from "../edit-set/edit-set.type";

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

export type LoadResult = {
  languages: Language[];
  cards: Omit<LearnItem, "inGameId">[]
}