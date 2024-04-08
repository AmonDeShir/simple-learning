import { Schema, SchemaTypes, model } from 'mongoose';
import { User } from '../types/user.type';

export const userSchema = new Schema<User, {}, {}>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  activated: { type: Boolean, default: false },
  refreshToken: { type: String, required: false },
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