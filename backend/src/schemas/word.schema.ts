import { Schema, model } from 'mongoose';
import { Word } from '../types/word.type';
import { ExampleType } from './example.schema';
import { LearningProgressType } from './learning-progress.schema';

export const wordSchema = new Schema<Word, {}, {}>({
  word: { type: String, required: true },
  language: { type: String, required: true },
  meaning: { type: String, required: true },
  audio: { type: String, required: false },
  firstExample: { type: ExampleType, required: false },
  secondExample: { type: ExampleType, required: false },
  progress: LearningProgressType,
});

