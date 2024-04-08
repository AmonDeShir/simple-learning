export type LocallyUser = {
  locallyToken?: string;
  sets: string[];
  savedWords: string;
  lastLearningDate: number;
  progress: {
    learning: number, 
    relearning: number,  
    graduated: number
  }[];
}