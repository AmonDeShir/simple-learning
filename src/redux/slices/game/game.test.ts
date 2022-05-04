import axios from "axios";
import { gameReducer, answer, loadSet } from "./game";


const DefaultState = {
  progress: 'idle' as const,
  mode: 'flashcards' as const,
  setId: '',
  items: [],
  correct: [],
  incorrect: [],
  remaining: [],
  item: '',
  itemIndex: 0,
  getItemsFrom: 'remaining' as const,
  statistics: {
    correct: [],
    incorrect: [],
    items: [],
  }
}

const stateAfterLoad = {
  progress: 'loading-success' as const,
  mode: 'mix' as const,
  setId: 'set_id',
  items: [
    {
      id: '0_1',
      inGameId: '0_1--0',
      text: 'item 1',
      translation: 'translation 1',
      invert: false,
      mode: 'flashcard' as const
    },
    {
      id: '0_2',
      inGameId: '0_2--0',
      wordId: '0_1',
      text: 'item 2',
      translation: 'translation 2',
      invert: false,
      mode: 'writing' as const
    },
    {
      id: '0_3',
      inGameId: '0_3--0',
      wordId: '0_1',
      text: 'item 3',
      translation: 'translation 3',
      invert: false,
      mode: 'speller' as const
    },
  ],
  correct: [],
  incorrect: [],
  remaining: ['0_1', '0_2', '0_3'],
  item: '0_1',
  itemIndex: 0,
  getItemsFrom: 'remaining' as const,
  statistics: {
    correct: [],
    incorrect: [],
    items: [],
  }
}

const state = {
  progress: 'loading-success' as const,
  mode: 'mix' as const,
  setId: 'set_id',
  items: [
    {
      id: '0_1',
      inGameId: '0_1--0',
      text: 'item 1',
      translation: 'translation 1',
      invert: false,
      mode: 'flashcard' as const
    },
    {
      id: '0_2',
      inGameId: '0_2--0',
      wordId: '0_1',
      text: 'item 2',
      translation: 'translation 2',
      invert: false,
      mode: 'writing' as const
    },
    {
      id: '0_3',
      inGameId: '0_3--0',
      wordId: '0_1',
      text: 'item 3',
      translation: 'translation 3',
      invert: false,
      mode: 'speller' as const
    },
    {
      id: '0_4',
      inGameId: '0_4--0',
      text: 'item 4',
      translation: 'translation 4',
      invert: false,
      mode: 'flashcard' as const
    },
    {
      id: '0_5',
      inGameId: '0_5--0',
      wordId: '0_4',
      text: 'item 5',
      translation: 'translation 5',
      invert: false,
      mode: 'writing' as const
    },
    {
      id: '0_6',
      inGameId: '0_6--0',
      wordId: '0_4',
      text: 'item 6',
      translation: 'translation 6',
      invert: false,
      mode: 'speller' as const
    }
  ],
  correct: ['0_4'],
  incorrect: ['0_5', '0_6'],
  remaining: ['0_1', '0_2', '0_3'],
  item: '0_1',
  itemIndex: 0,
  getItemsFrom: 'remaining' as const,
  statistics: {
    correct: [
      {
        id: '0_4',
        inGameId: '0_4-0',
        text: 'item 4',
        translation: 'translation 4',
        invert: false,
        mode: 'flashcard' as const
      },
    ],
    incorrect: [
      {
        id: '0_5',
        inGameId: '0_5-0',
        wordId: '0_4',
        text: 'item 5',
        translation: 'translation 5',
        invert: false,
        mode: 'writing' as const
      },
      {
        id: '0_6',
        inGameId: '0_6-0',
        wordId: '0_4',
        text: 'item 6',
        translation: 'translation 6',
        invert: false,
        mode: 'speller' as const
      }
    ],
    items: ['0_4', '0_5', '0_6'],
  }
}

describe(`gameSlice`, () => {
  it(`should set state to 'loading-pending' when loading`, () => {
    expect(gameReducer(undefined, {
      type: `gameSlice/loadSet/pending`,
      payload: undefined
    })).toEqual({
      ...DefaultState,
      progress: 'loading-pending',
    })
  });

  it(`should set state to 'loading-error' when loading fails`, () => {
    expect(gameReducer(undefined, {
      type: `gameSlice/loadSet/rejected`,
      payload: undefined
    })).toEqual({
      ...DefaultState,
      progress: 'loading-error',
    })
  });

  it(`should set state to 'loading-success' when loading succeeds`, () => {
    expect(gameReducer(undefined, {
      type: `gameSlice/loadSet/fulfilled`,
      payload: {
        mode: 'mix',
        id: 'set_id',
        items: [
          {
            id: '0_1',
            inGameId: '0_1-0',
            text: 'item 1',
            translation: 'translation 1',
            invert: false,
            mode: 'flashcard' as const
          },
          {
            id: '0_2',
            inGameId: '0_2-0',
            wordId: '0_1',
            text: 'item 2',
            translation: 'translation 2',
            invert: false,
            mode: 'writing' as const
          },
          {
            id: '0_3',
            inGameId: '0_3-0',
            wordId: '0_1',
            text: 'item 3',
            translation: 'translation 3',
            invert: false,
            mode: 'speller' as const
          }
        ]
      }
    })).toEqual(stateAfterLoad);
  });

  it(`should set the selected item to an empty string if the playing set has no items`, () => {
    expect(gameReducer(undefined, {
      type: `gameSlice/loadSet/fulfilled`,
      payload: {
        mode: 'mix',
        id: 'set_id',
        items: []
      }
    })).toEqual({
      mode: 'mix',
      setId: 'set_id',
      progress: 'loading-success',
      items: [],
      correct: [],
      incorrect: [],
      remaining: [],
      item: '',
      itemIndex: 0,
      getItemsFrom: 'remaining' as const,
      statistics: {
        correct: [],
        incorrect: [],
        items: [],
      }
    });
  });

  describe(`answerCorrect`, () => {
    let randomSpy: jest.SpyInstance;

    beforeAll(() => {
      randomSpy = jest.spyOn(Math, 'random').mockReturnValue(1);
    });

    afterAll(() => {
      randomSpy.mockRestore();
    });

    it(`should add the item to the correct array if it isn't inside of the incorrect array`, () => {
      const result = gameReducer(state, {
        type: `game/answerCorrect`,
        payload: undefined
      });

      expect(result).toEqual({
        ...state,
        correct: ['0_4', '0_1'],
        incorrect: ['0_5', '0_6'],
        remaining: ['0_2', '0_3'],
        statistics: expect.any(Object),
      });
    });

    it(`should add the item to the remaining array if it is inside of the incorrect array`, () => {
      const result = gameReducer({ ...state, item: '0_5' }, {
        type: `game/answerCorrect`,
        payload: undefined
      });

      expect(result).toEqual({
        ...state,
        item: '0_5',
        correct: ['0_4'],
        incorrect: ['0_6'],
        remaining: ['0_5', '0_1', '0_2', '0_3'],
        statistics: expect.any(Object),
      });
    })
  });

  describe(`answerIncorrect`, () => {
    let randomSpy: jest.SpyInstance;

    beforeAll(() => {
      randomSpy = jest.spyOn(Math, 'random').mockReturnValue(1);
    });

    afterAll(() => {
      randomSpy.mockRestore();
    });

    it(`should add the item to the incorrect array if it isn't inside of the incorrect array`, () => {
      const result = gameReducer(state, {
        type: `game/answerIncorrect`,
        payload: undefined
      });

      expect(result).toEqual({
        ...state,
        correct: ['0_4'],
        incorrect: ['0_5', '0_6', '0_1'],
        remaining: ['0_2', '0_3'],
        statistics: expect.any(Object),
      });
    });

    it(`should move item to the end of the incorrect array if it is inside of the incorrect array`, () => {
      const result = gameReducer({ ...state, item: '0_5' }, {
        type: `game/answerIncorrect`,
        payload: undefined
      });

      expect(result).toEqual({
        ...state,
        item: '0_5',
        correct: ['0_4'],
        incorrect: ['0_6', '0_5'],
        remaining: ['0_1', '0_2', '0_3'],
        statistics: expect.any(Object),
      });
    })
  });

  describe(`updateStatistics`, () => {
    it(`should update the statistics if the item wasn't answer before`, () => {
      const resultCorrect = gameReducer(state, {
        type: `game/updateStatistics`,
        payload: true
      });

      expect(resultCorrect).toEqual({
        ...state,
        statistics: {
          correct: [
            {
              id: '0_4',
              inGameId: '0_4-0',
              text: 'item 4',
              translation: 'translation 4',
              invert: false,
              mode: 'flashcard' as const
            },
            {
              id: '0_1',
              inGameId: '0_1--0',
              text: 'item 1',
              translation: 'translation 1',
              invert: false,
              mode: 'flashcard' as const
            },
          ],
          incorrect: [
            {
              id: '0_5',
              inGameId: '0_5-0',
              wordId: '0_4',
              text: 'item 5',
              translation: 'translation 5',
              invert: false,
              mode: 'writing' as const
            },
            {
              id: '0_6',
              inGameId: '0_6-0',
              wordId: '0_4',
              text: 'item 6',
              translation: 'translation 6',
              invert: false,
              mode: 'speller' as const
            }
          ],
          items: ['0_4', '0_5', '0_6', '0_1'],
        }
      });

      const resultIncorrect = gameReducer(state, {
        type: `game/updateStatistics`,
        payload: false
      });

      expect(resultIncorrect).toEqual({
        ...state,
        statistics: {
          correct: [
            {
              id: '0_4',
              inGameId: '0_4-0',
              text: 'item 4',
              translation: 'translation 4',
              invert: false,
              mode: 'flashcard' as const
            },
          ],
          incorrect: [
            {
              id: '0_5',
              inGameId: '0_5-0',
              wordId: '0_4',
              text: 'item 5',
              translation: 'translation 5',
              invert: false,
              mode: 'writing' as const
            },
            {
              id: '0_6',
              inGameId: '0_6-0',
              wordId: '0_4',
              text: 'item 6',
              translation: 'translation 6',
              invert: false,
              mode: 'speller' as const
            },
            {
              id: '0_1',
              inGameId: '0_1--0',
              text: 'item 1',
              translation: 'translation 1',
              invert: false,
              mode: 'flashcard' as const
            },
          ],
          items: ['0_4', '0_5', '0_6', '0_1'],
        }
      });
    });

    it(`shouldn't update the statistics if the item was answer before`, () => {
      const result = gameReducer({ ...state, item: '0_5' }, {
        type: `game/updateStatistics`,
        payload: true
      });

      expect(result).toEqual({
        ...state,
        item: '0_5',
      });
    });

    it(`shouldn't update the statistics if the item not exist`, () => {
      const result = gameReducer({ ...state, item: '' }, {
        type: `game/updateStatistics`,
        payload: true
      });

      expect(result).toEqual({
        ...state,
        item: ''
      });
    });
  });

  describe(`loadNextItem`, () => {
    const testState = {
      ...state,
      item: '0_1',
      correct: ['0_4', '0_1'],
      incorrect: ['0_5', '0_6'],
      remaining: ['0_2', '0_3'],
    }

    it(`should load the next item from the remaining array`, () => {
      const result = gameReducer(testState, {
        type: `game/loadNextItem`,
        payload: undefined
      });

      expect(result).toEqual({
        ...testState,
        itemIndex: 1,
        item: '0_2',
        items: [
          testState.items[0],
          {
            ...testState.items[1],
            inGameId: '0_2--1',
          },
          ...testState.items.slice(2),
        ]
      });
    });

    it(`should load an item from the incorrect array if the state's getItemsFrom is set to 'incorrect'`, () => {
      const result = gameReducer({ ...testState, getItemsFrom: 'incorrect' }, {
        type: `game/loadNextItem`,
        payload: undefined
      });

      expect(result).toEqual({
        ...testState,
        getItemsFrom: 'incorrect',
        itemIndex: 0,
        item: '0_5',
        items: [
          ...testState.items.slice(0, 4),
          {
            ...testState.items[4],
            inGameId: '0_5--1',
          },
          testState.items[5],
        ]
      });
    });

    it(`should load the next item from the remaining array if the state's getItemsFrom is set to 'incorrect' and the incorrect array is empty`, () => {
      const result = gameReducer({ ...testState, getItemsFrom: 'incorrect', incorrect: [] }, {
        type: `game/loadNextItem`,
        payload: undefined
      });

      expect(result).toEqual({
        ...testState,
        getItemsFrom: 'remaining',
        incorrect: [],
        itemIndex: 1,
        item: '0_2',
        items: [
          testState.items[0],
          {
            ...testState.items[1],
            inGameId: '0_2--1',
          },
          ...testState.items.slice(2),
        ]
      });
    });

    it(`should change the state's getItemsFrom to 'incorrect' if the state's itemIndex is equal to 10`, () => {
      const result = gameReducer({ ...testState, itemIndex: 10 }, {
        type: `game/loadNextItem`,
        payload: undefined
      });

      expect(result).toEqual({
        ...testState,
        getItemsFrom: 'incorrect',
        itemIndex: 10,
        item: '0_5',
        items: [
          ...testState.items.slice(0, 4),
          {
            ...testState.items[4],
            inGameId: '0_5--1',
          },
          testState.items[5],
        ]
      });
    })

    it(`should change the state's getItemsFrom to 'incorrect' if the state's remaining array is empty`, () => {
      const result = gameReducer({ ...testState, remaining: [] }, {
        type: `game/loadNextItem`,
        payload: undefined
      });

      expect(result).toEqual({
        ...testState,
        getItemsFrom: 'incorrect',
        itemIndex: 0,
        item: '0_5',
        remaining: [],
        items: [
          ...testState.items.slice(0, 4),
          {
            ...testState.items[4],
            inGameId: '0_5--1',
          },
          testState.items[5],
        ]
      });
    })

    it(`should set the progress to 'done' if the remaining array and the incorrect array are empty`, () => {
      const result = gameReducer({ ...testState, remaining: [], incorrect: [] }, {
        type: `game/loadNextItem`,
        payload: undefined
      });

      expect(result).toEqual({
        ...testState,
        progress: 'done',
        itemIndex: 1,
        item: '0_1',
        remaining: [],
        incorrect: [],
      });
    })
  });
});

describe(`gameSlice/loadSet`, () => {
  let getSpy: jest.SpyInstance;
  const dispatch: any = () => {};
  const getState: any = () => {};

  beforeAll(() => {
    getSpy = jest.spyOn(axios, 'get');
  });

  beforeEach(() => {
    getSpy.mockClear();
  });

  afterAll(() => {
    getSpy.mockRestore();
  });
  
  it(`should return the loaded data`, async () => {
    getSpy.mockResolvedValue({
      status: 200,
      data: 'loaded data'
    });

    const result = await loadSet({ id: 'set_id', mode: 'mix' })(dispatch, getState, {});

    expect(result).toEqual({
      type: `gameSlice/loadSet/fulfilled`,
      payload: 'loaded data',
      meta: expect.any(Object)
    });
  });

  it(`should throw an error if the id parameter is undefined`, async () => {
    const result = await loadSet({ mode: 'mix' })(dispatch, getState, {});
    expect(result.type).toEqual('gameSlice/loadSet/rejected');
  });

  it(`should throw an error if the mode parameter is undefined`, async () => {
    const result = await loadSet({ id: 'set_id' })(dispatch, getState, {});
    expect(result.type).toEqual('gameSlice/loadSet/rejected');
  });
  
  it(`should throw an error if the status of the fetchData's response is other than 200`, async () => {
    getSpy.mockRejectedValue({ status: 500 });

    const result = await loadSet({ id: 'set_id', mode: 'mix' })(dispatch, getState, {});
    expect(result.type).toEqual('gameSlice/loadSet/rejected');
  });
});

describe(`gameSlice/answer`, () => {
  const dispatchSpy = jest.fn();
  const getState: any = () => {};

  beforeEach(() => {
    dispatchSpy.mockClear();
  });

  it(`should dispatch the answerCorrect action if the payload is true`, () => {
    answer(true)(dispatchSpy, getState, {});

    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: `game/answerCorrect`,
      payload: undefined,
    });
  });

  it(`should dispatch the answerIncorrect action if the payload is false`, () => {
    answer(false)(dispatchSpy, getState, {});

    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: `game/answerIncorrect`,
      payload: undefined,
    });
  });

  it(`should dispatch the updateStatistics and the loadNextItem actions`, () => {
    answer(true)(dispatchSpy, getState, {});

    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      type: `game/updateStatistics`,
      payload: true,
    });

    expect(dispatchSpy).toHaveBeenNthCalledWith(4, {
      type: `game/loadNextItem`,
      payload: undefined,
    });
  });
})