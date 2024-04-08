import { Schema, model } from 'mongoose';
import { LocallyUser } from '../types/locally-user.type';

export const locallyUserSchema = new Schema<LocallyUser, {}, {}>({
  locallyToken: { type: String, required: false },
  sets: [{ type: String, default: [] }],
  savedWords: { type: String, default: "" },
  lastLearningDate: { type: Number, default: 0 },
  progress: [{
    type: {
      learning: { type: Number, default: 0 },
      relearning: { type: Number, default: 0 },
      graduated: { type: Number, default: 0 },
    }
  }]
});