import { Schema, model, Model } from 'mongoose';
import { TranslationEntity, WordListEntity } from '../types/translation.type';

const WordListSchema = new Schema<WordListEntity, {}, {}>({
  wordId: { type: String, required: true },
  data: [{ type: String, default: [] }],
});

const TranslationSchema = new Schema<TranslationEntity, {}, {}>({
  wordId: { type: String, required: true },
  translations: [{ type: String, default: [] }],
});

export const wordListDao = model('wordList', WordListSchema);
export const translationPlDao = model('translation_pl', TranslationSchema);
export const translationEnDao = model('translation_en', TranslationSchema);
export const translationIsvDao = model('translation_isv', TranslationSchema);

export type TranslationDao = Model<TranslationEntity, {}, {}, {}, Schema<TranslationEntity>>;