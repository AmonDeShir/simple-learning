import { LearningPhase } from "../models/learning-progress.model";

export type LearningProgress = {
  eFactor: number;
  interval: number;
  intervalBeforeLearning: number;
  phase: LearningPhase,
  nextRepetition: number,
};
