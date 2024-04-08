import { StartProgress, superMemo } from './super-memo';
import { SuperMemoItem } from './super-memo.types';

describe('StartProgress', () => {
  expect(StartProgress).toEqual({
    phase: 'learning',
    interval: 0,
    eFactor: 2.5,
    intervalBeforeLearning: 0,
  });
});

describe('superMemo', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(100);
  });

  describe('learning mode', () => {
    const data: SuperMemoItem = {
      phase: 'learning',
      interval: 0,
      eFactor: 2.5,
      intervalBeforeLearning: 0,
    };

    it(`should increase the interval if answer was correct`, () => {
      expect(superMemo(data, 1)).toEqual({
        phase: 'learning',
        interval: 1,
        eFactor: 2.5,
        intervalBeforeLearning: 0,
        nextRepetition: 60100,
      });

      expect(superMemo(data, 2)).toEqual({
        phase: 'learning',
        interval: 1,
        eFactor: 2.5,
        intervalBeforeLearning: 0,
        nextRepetition: 60100,
      });

      expect(superMemo(data, 3)).toEqual({
        phase: 'learning',
        interval: 1,
        eFactor: 2.5,
        intervalBeforeLearning: 0,
        nextRepetition: 60100,
      });
    });

    it(`should set the interval to fifteen days and change the phase to "graduated" if the interval has been increased five times`, () => {
      expect(superMemo(data, 1)).toEqual({
        phase: 'learning',
        interval: 1,
        eFactor: 2.5,
        intervalBeforeLearning: 0,
        nextRepetition: 60100,
      });

      expect(superMemo({ ...data, interval: 1 }, 1)).toEqual({
        phase: 'learning',
        interval: 10,
        eFactor: 2.5,
        intervalBeforeLearning: 0,
        nextRepetition: 600100,
      });

      expect(superMemo({ ...data, interval: 10 }, 1)).toEqual({
        phase: 'learning',
        interval: 1440,
        eFactor: 2.5,
        intervalBeforeLearning: 0,
        nextRepetition: 86400100,
      });

      expect(superMemo({ ...data, interval: 1440 }, 1)).toEqual({
        phase: 'learning',
        interval: 8640,
        eFactor: 2.5,
        intervalBeforeLearning: 0,
        nextRepetition: 518400100,
      });

      expect(superMemo({ ...data, interval: 8640 }, 1)).toEqual({
        phase: 'graduated',
        interval: 21600,
        eFactor: 2.5,
        intervalBeforeLearning: 0,
        nextRepetition: 1296000100,
      });
    });

    it(`should reset progress if answer was incorrect`, () => {
      expect(superMemo({ ...data, interval: 1440 }, 0)).toEqual({
        phase: 'learning',
        interval: 0,
        eFactor: 2.5,
        intervalBeforeLearning: 0,
        nextRepetition: 100,
      });
    });
  });

  describe('graduated mode', () => {
    const data: SuperMemoItem = {
      phase: 'graduated',
      eFactor: 2.5,
      interval: 21600,
      intervalBeforeLearning: 0,
    };

    test('easy', () => {
      expect(superMemo(data, 3)).toEqual({
        phase: 'graduated',
        interval: 57240,
        eFactor: 2.65,
        intervalBeforeLearning: 0,
        nextRepetition: 3434400100,
      });
    });

    test('good', () => {
      expect(superMemo(data, 2)).toEqual({
        phase: 'graduated',
        interval: 54000,
        eFactor: 2.5,
        intervalBeforeLearning: 0,
        nextRepetition: 3240000100,
      });
    });

    test('hard', () => {
      expect(superMemo(data, 1)).toEqual({
        phase: 'graduated',
        interval: 50760,
        eFactor: 2.35,
        intervalBeforeLearning: 0,
        nextRepetition: 3045600100,
      });
    });

    test('again', () => {
      expect(superMemo(data, 0)).toEqual({
        phase: 'relearning',
        interval: 0,
        eFactor: 2.3,
        intervalBeforeLearning: 49679.99999999999,
        nextRepetition: 100,
      });
    });
  });

  describe('relearning mode', () => {
    const data: SuperMemoItem = {
      phase: 'relearning',
      interval: 0,
      eFactor: 2.3,
      intervalBeforeLearning: 49679.99999999999,
    };

    it(`should increase the interval if answer was correct`, () => {
      expect(superMemo(data, 1)).toEqual({
        phase: 'relearning',
        interval: 1,
        eFactor: 2.3,
        intervalBeforeLearning: 49679.99999999999,
        nextRepetition: 60100,
      });

      expect(superMemo(data, 2)).toEqual({
        phase: 'relearning',
        interval: 1,
        eFactor: 2.3,
        intervalBeforeLearning: 49679.99999999999,
        nextRepetition: 60100,
      });

      expect(superMemo(data, 3)).toEqual({
        phase: 'relearning',
        interval: 1,
        eFactor: 2.3,
        intervalBeforeLearning: 49679.99999999999,
        nextRepetition: 60100,
      });
    });

    it(`should set the interval to 50% of the intervalBeforeLearning's value, change the phase to 'graduated' and reset the intervalBeforeLearning's value if the interval has been increased five times`, () => {
      expect(superMemo(data, 1)).toEqual({
        phase: 'relearning',
        interval: 1,
        eFactor: 2.3,
        intervalBeforeLearning: 49679.99999999999,
        nextRepetition: 60100,
      });

      expect(superMemo({ ...data, interval: 1 }, 1)).toEqual({
        phase: 'relearning',
        interval: 10,
        eFactor: 2.3,
        intervalBeforeLearning: 49679.99999999999,
        nextRepetition: 600100,
      });

      expect(superMemo({ ...data, interval: 10 }, 1)).toEqual({
        phase: 'relearning',
        interval: 1440,
        eFactor: 2.3,
        intervalBeforeLearning: 49679.99999999999,
        nextRepetition: 86400100,
      });

      expect(superMemo({ ...data, interval: 1440 }, 1)).toEqual({
        phase: 'relearning',
        interval: 8640,
        eFactor: 2.3,
        intervalBeforeLearning: 49679.99999999999,
        nextRepetition: 518400100,
      });

      expect(superMemo({ ...data, interval: 8640 }, 1)).toEqual({
        phase: 'graduated',
        interval: 24839.999999999996,
        eFactor: 2.3,
        intervalBeforeLearning: 0,
        nextRepetition: 1490400099.9999998,
      });
    });

    it(`should reset the progress if answer was incorrect`, () => {
      expect(superMemo({ ...data, interval: 1440 }, 0)).toEqual({
        phase: 'relearning',
        interval: 0,
        eFactor: 2.3,
        intervalBeforeLearning: 49679.99999999999,
        nextRepetition: 100,
      });
    });
  });
});
