import { Types, Document } from 'mongoose';
import { WordConstructor, WordEditor } from './word.type';

export type SetProgress = {
  learning: number;
  relearning: number;
  graduated: number; 
}

export type Set = {
  user: string;
  title: string;
  words: string[];
  lastLearn?: number;
  progress: SetProgress;
}

export type SetConstructor = Omit<Set, 'lastLearn' | 'progress' | 'words'> & {
  words: (string | WordConstructor | WordEditor)[]
}

export type SetEditor = Partial<Omit<Set, "words">> & { 
  id: string, 
  words?: (string | WordConstructor | WordEditor)[],
}

export type SetDocument = Document<unknown, any, Set> & Set & { _id: Types.ObjectId }