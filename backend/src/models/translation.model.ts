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

export const wordListModel = model('wordList', WordListSchema);
export const translationPlModel = model('translation_pl', TranslationSchema);
export const translationEnModel = model('translation_en', TranslationSchema);
export const translationIsvModel = model('translation_isv', TranslationSchema);

export type TranslationModel = Model<TranslationEntity, {}, {}, {}, Schema<TranslationEntity>>;