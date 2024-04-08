import e from 'express';
import { Types, Document } from 'mongoose';
import { Example, ExampleConstructor } from './example.type';
import { Language } from './languages.type';
import { LearningProgress } from "./learning-progress.type";

export type Word = {
  word: string;
  meaning: string;
  language: Language;
  audio?: string;
  firstExample?: Example;
  secondExample?: Example;
  progress: LearningProgress;
}

export type WordConstructor = Omit<Word, 'audio' | 'progress'> & { 
  firstExample?: ExampleConstructor,
  secondExample?: ExampleConstructor,
};

export type WordEditor = Partial<Omit<Word, 'audio'>> & { 
  id: string, 
  firstExample?: ExampleConstructor,
  secondExample?: ExampleConstructor,
}

export type WordDocument = Document<unknown, any, Word> & Word & { _id: Types.ObjectId }
export type WordWithId = Word & { _id: string };