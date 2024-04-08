import { Language } from "./languages.type";
import { LearningProgress } from "./learning-progress.type";

export type LearnItem = {
  id: string;
  set: string;
  wordId?: string;
  audio?: string;
  language: Language;
  text: string;
  translation: string;
  invert: boolean;
  progress: LearningProgress;
  mode: 'flashcard' | 'writing' | 'information';
}

export type LearnItemWithExamples = {
  id: string;
  set: string;
  wordId?: string;
  audio?: string;
  language: Language;
  text: string;
  translation: string;
  invert: boolean;
  progress: LearningProgress;
  mode: 'flashcard' | 'writing' | 'information';
  examples: LearnItem[]
}
