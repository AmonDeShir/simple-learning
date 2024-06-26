import { LearningPhase } from "../schemas/learning-progress.schema";

export type LearningProgress = {
  eFactor: number;
  interval: number;
  intervalBeforeLearning: number;
  phase: LearningPhase,
  nextRepetition: number,
};
