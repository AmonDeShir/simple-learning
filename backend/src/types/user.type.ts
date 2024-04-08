export type User = {
  name: string;
  email: string;
  password: string;
  activated: boolean;
  refreshToken?: string;
  sets: string[];
  savedWords: string;
  lastLearningDate: number;
  progress: {
    learning: number, 
    relearning: number,  
    graduated: number
  }[];
}

export type UserConstructor = Omit<User, 'sets' | 'words' | 'refreshToken' | 'activated' | 'lastLearningDate' | 'progress'>;