import {
  SuperMemoGrade,
  SuperMemoItem,
  SuperMemoOutput,
} from './super-memo.types';

const fifteenDays = 21600;
const settings = { steps: [0, 1, 10, 1440, 8640] };

export const lastLearningStep = settings.steps[4];

export const StartProgress: SuperMemoItem = {
  phase: 'learning',
  interval: 0,
  eFactor: 2.5,
  intervalBeforeLearning: 0,
};

export function superMemo(
  item: SuperMemoItem,
  grade: SuperMemoGrade,
): SuperMemoOutput {
  if (item.phase === 'learning' || item.phase === 'relearning') {
    return learningMode(item, grade);
  } else {
    return graduatedMode(item, grade);
  }
}

function learningMode(
  item: SuperMemoItem,
  grade: SuperMemoGrade,
): SuperMemoOutput {
  let index = grade === 0 ? 0 : settings.steps.indexOf(item.interval) + 1;

  if (index >= 5) {
    const interval =
      item.phase === 'learning'
        ? fifteenDays
        : item.intervalBeforeLearning * 0.5;

    return {
      phase: 'graduated',
      interval: interval,
      eFactor: item.eFactor,
      intervalBeforeLearning: 0,
      nextRepetition: intervalToDate(interval),
    };
  }

  return {
    phase: item.phase,
    interval: settings.steps[index],
    eFactor: item.eFactor,
    intervalBeforeLearning: item.intervalBeforeLearning,
    nextRepetition: intervalToDate(settings.steps[index]),
  };
}

function graduatedMode(
  item: SuperMemoItem,
  grade: SuperMemoGrade,
): SuperMemoOutput {
  let eFactor = item.eFactor;
  let nextInterval, intervalBeforeLearning;

  switch (grade) {
    case 0:
      eFactor -= 0.2;
      break;
    case 1:
      eFactor -= 0.15;
      break;
    case 3:
      eFactor += 0.15;
      break;
  }

  eFactor = Math.max(1.3, eFactor);

  if (grade === 0) {
    nextInterval = settings.steps[0];
    intervalBeforeLearning = item.interval * eFactor;
  } else {
    nextInterval = item.interval * eFactor;
    intervalBeforeLearning = 0;
  }

  return {
    phase: grade === 0 ? 'relearning' : 'graduated',
    interval: nextInterval,
    intervalBeforeLearning,
    eFactor,
    nextRepetition: intervalToDate(nextInterval),
  };
}

function intervalToDate(interval: number) {
  return Date.now() + interval * 60000;
}
