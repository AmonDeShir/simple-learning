import { LearningProgressType } from './learning-progress.schema';

export const ExampleType = {
  example: { type: String, required: true },
  translation: { type: String, required: true },
  audio: { type: String, required: false },
  progress: LearningProgressType,
};
