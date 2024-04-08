import { Language } from "./languages.type";
import { LearningProgress } from "./learning-progress.type";

export type Example = {
  example: string;
  translation: string;
  audio?: string;
  progress: LearningProgress;
}

export type ExampleConstructor = Omit<Example, 'audio' | 'progress'>;