import { Schema, model } from 'mongoose';
import { Set } from '../types/set.type';

const SetProgressType = {
  learning: { type: Number, default: 0 },
  relearning: { type: Number, default: 0 },
  graduated: { type: Number, default: 0 },
}

const schema = new Schema<Set, {}, {}>({
  user: { type: String, required: true },
  title: { type: String, required: true },
  words: [{ type: String, default: [] }],
  lastLearn: { type: Number, required: false },
  progress: SetProgressType
});

export const setModel = model('Set', schema);