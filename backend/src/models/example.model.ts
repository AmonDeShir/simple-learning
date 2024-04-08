import { LearningProgressType } from './learning-progress.model';

export const ExampleType = {
  example: { type: String, required: true },
  translation: { type: String, required: true },
  audio: { type: String, required: false },
  progress: LearningProgressType,
};
