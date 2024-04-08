import { Schema, model } from 'mongoose';
import { Word } from '../types/word.type';
import { ExampleType } from './example.model';
import { LearningProgressType } from './learning-progress.model';

const schema = new Schema<Word, {}, {}>({
  word: { type: String, required: true },
  language: { type: String, required: true },
  meaning: { type: String, required: true },
  audio: { type: String, required: false },
  firstExample: { type: ExampleType, required: false },
  secondExample: { type: ExampleType, required: false },
  progress: LearningProgressType,
});

export const wordModel = model('Word', schema);