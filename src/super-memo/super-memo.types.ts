export type SuperMemoPhase = 'learning' | 'relearning' | 'graduated';

export type SuperMemoItem = {
  eFactor: number;
  interval: number;
  intervalBeforeLearning: number;
  phase: SuperMemoPhase;
};

/**
 * @type 0 - again (eFactor -= 0.2)
 * @type 1 - hard (eFactor -= 0.15)
 * @type 2 - good (eFactor)
 * @type 3 - easy (eFactor += 0.15)
 */
export type SuperMemoGrade = 0 | 1 | 2 | 3;
export type SuperMemoOutput = SuperMemoItem & { nextRepetition: number };
