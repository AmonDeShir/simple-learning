export const LearningProgressType = {
  eFactor: { type: Number, default: 2.5 },
  interval: { type: Number, default: 0 },
  intervalBeforeLearning: { type: Number, default: 0 },
  phase: { type: String, default: 'learning' },
  nextRepetition: { type: Number },
};

export const DefaultLearningProgress = () => ({
  eFactor: 2.5,
  interval: 0,
  intervalBeforeLearning: 0,
  phase: 'learning' as LearningPhase,
  nextRepetition: Date.now(),
})

export type LearningPhase = 'learning' | 'relearning' | 'graduated';