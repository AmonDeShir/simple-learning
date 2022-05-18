import axios from "axios";
import { mockRandom, resetMockRandom } from 'jest-mock-random';
import { learnReducer, answer, loadData, saveProgress, saveProgressInGame } from "./learn";
 
const DefaultState = {
  inGameSavingProgress: {
    state: 'done' as const,
    message: 'Save learning progress'
  },
  progress: {
    mode: 'loading' as const,
    state: 'loading' as const,
    message: ''
  },
  items: [],
  done: [],
  learning: [],
  remaining: [],
  itemIndex: 0,
  getItemsFrom: 'remaining',
  item: '',
  statistics: {}
}

const stateAfterLoad = {
  inGameSavingProgress: {
    state: 'done' as const,
    message: 'Save learning progress'
  },
  progress: {
    mode: 'loading' as const,
    state: 'success' as const,
    message: ''
  },
  items: [
    {
      id: '1',
      inGameId: '1--0',
      text: 'item 1',
      translation: 'translation 1',
      invert: false,
      set: 'set_id_0',
      mode: 'flashcard' as const,
      progress: {
        eFactor: 2.5,
        interval: 0,
        intervalBeforeLearning: 0,
        phase: "learning" as const,
        nextRepetition: 1
      },
    },
    {
      id: '2',
      inGameId: '2--0',
      text: 'item 2',
      translation: 'translation 2',
      invert: false,
      set: 'set_id_0',
      mode: 'writing' as const,
      progress: {
        eFactor: 2.5,
        interval: 0,
        intervalBeforeLearning: 0,
        phase: "learning" as const,
        nextRepetition: 1
      },
    },
    {
      id: '3',
      inGameId: '3--0',
      text: 'item 3',
      translation: 'translation 3',
      invert: false,
      set: 'set_id_0',
      mode: 'information' as const,
      progress: {
        eFactor: 2.5,
        interval: 0,
        intervalBeforeLearning: 0,
        phase: "learning" as const,
        nextRepetition: 1
      },
    },
  ],
  done: [],
  learning: [],
  remaining: ["1", "2", "3"],
  itemIndex: 0,
  getItemsFrom: 'remaining',
  item: '1',
  statistics: {}
}

const state = {
  inGameSavingProgress: {
    state: 'done' as const,
    message: 'Save learning progress'
  },
  progress: {
    mode: 'loading' as const,
    state: 'success' as const,
    message: ''
  },
  items: [
    {
      id: '1',
      inGameId: '1--0',
      text: 'item 1',
      translation: 'translation 1',
      invert: false,
      set: 'set_id_0',
      mode: 'flashcard' as const,
      progress: {
        eFactor: 2.5,
        interval: 0,
        intervalBeforeLearning: 0,
        phase: "learning" as const,
        nextRepetition: 1
      },
    },
    {
      id: '2',
      inGameId: '2--0',
      text: 'item 2',
      translation: 'translation 2',
      invert: false,
      set: 'set_id_0',
      mode: 'writing' as const,
      progress: {
        eFactor: 2.5,
        interval: 120,
        intervalBeforeLearning: 0,
        phase: "graduated" as const,
        nextRepetition: 1651947390727
      },
    },
    {
      id: '3',
      inGameId: '3--0',
      text: 'item 3',
      translation: 'translation 3',
      invert: false,
      set: 'set_id_0',
      mode: 'information' as const,
      progress: {
        eFactor: 2.5,
        interval: 0,
        intervalBeforeLearning: 0,
        phase: "learning" as const,
        nextRepetition: 1
      },
    },
    {
      id: '4',
      inGameId: '4--0',
      text: 'item 4',
      translation: 'translation 4',
      invert: false,
      set: 'set_id_0',
      mode: 'flashcard' as const,
      progress: {
        eFactor: 2.5,
        interval: 0,
        intervalBeforeLearning: 0,
        phase: "learning" as const,
        nextRepetition: 1
      },
    },
    {
      id: '5',
      inGameId: '5--0',
      text: 'item 5',
      translation: 'translation 5',
      invert: false,
      set: 'set_id_0',
      mode: 'writing' as const,
      progress: {
        eFactor: 2.5,
        interval: 0,
        intervalBeforeLearning: 0,
        phase: "learning" as const,
        nextRepetition: 1
      },
    },
    {
      id: '6',
      inGameId: '6--0',
      text: 'item 6',
      translation: 'translation 6',
      invert: false,
      set: 'set_id_0',
      mode: 'information' as const,
      progress: {
        eFactor: 2.5,
        interval: 0,
        intervalBeforeLearning: 0,
        phase: "learning" as const,
        nextRepetition: 1
      },
    },
    {
      id: '7',
      inGameId: '7--0',
      text: 'item 7',
      translation: 'translation 7',
      invert: false,
      set: 'set_id_0',
      mode: 'writing' as const,
      progress: {
        eFactor: 2.5,
        interval: 0,
        intervalBeforeLearning: 0,
        phase: "learning" as const,
        nextRepetition: 1
      },
    },
    {
      id: '8',
      inGameId: '8--0',
      text: 'item 8',
      translation: 'translation 8',
      invert: false,
      set: 'set_id_0',
      mode: 'writing' as const,
      progress: {
        eFactor: 2.5,
        interval: 0,
        intervalBeforeLearning: 0,
        phase: "learning" as const,
        nextRepetition: 1
      },
    },
  ],
  done: ["4"],
  learning: ["5", "6", "7", "8"],
  remaining: ["1", "2", "3"],
  itemIndex: 0,
  getItemsFrom: 'remaining' as const,
  item: '1',
  statistics: {
    "4": {
      answers: [0.5, 1],
      nextRepetition: 1651774590727,
    },
    "5": {
      answers: [0, 0],
      nextRepetition: 1651774590727,
    },
    "6": {
      answers: [0, 0.5, 0.5],
      nextRepetition: 1651774590727,
    }
  }
}

describe(`learnSlice`, () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(1651774590727);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it(`should set state to 'loading' when the set data is fetching`, () => {
    expect(learnReducer(undefined, {
      type: `learnSlice/loadData/pending`,
      payload: undefined
    })).toEqual({
      ...DefaultState,
      progress: {
        mode: 'loading',
        state: 'loading',
        message: ''
      }
    })
  });

  it(`should set state to 'loading' when the learning progress is sending to server`, () => {
    expect(learnReducer(undefined, {
      type: `learnSlice/saveProgress/pending`,
      payload: undefined
    })).toEqual({
      ...DefaultState,
      progress: {
        mode: 'saving',
        state: 'loading',
        message: ''
      }
    })
  });

  it(`should set state to 'error' when the fetching set data failed`, () => {
    expect(learnReducer(undefined, {
      type: `learnSlice/loadData/rejected`,
      payload: undefined
    })).toEqual({
      ...DefaultState,
      progress: {
        mode: 'loading',
        state: 'error',
        message: 'There was an error. Please try again'
      }
    })
  });

  it(`should set state to 'error' when the sending progress operation failed`, () => {
    expect(learnReducer(undefined, {
      type: `learnSlice/saveProgress/rejected`,
      payload: undefined
    })).toEqual({
      ...DefaultState,
      progress: {
        mode: 'saving',
        state: 'error',
        message: 'There was an error. Please try again'
      }
    })
  });

  it(`should set state to 'success' when the sending progress operation was successful`, () => {
    expect(learnReducer(undefined, {
      type: `learnSlice/saveProgress/fulfilled`,
      payload: undefined
    })).toEqual({
      ...DefaultState,
      progress: {
        mode: 'saving',
        state: 'success',
        message: ''
      }
    })
  });

  it(`should set state to 'empty' when the items array of the fetched data is an empty array`, () => {
    expect(learnReducer(undefined, {
      type: `learnSlice/loadData/fulfilled`,
      payload: []
    })).toEqual({
      ...DefaultState,
      progress: {
        mode: 'loading',
        state: 'empty',
        message: 'There is nothing to learn for today, please try again tomorrow or add some words'
      }
    })
  });

  it(`should set state to 'success' when the fetching data operation was successful`, () => {
    expect(learnReducer(undefined, {
      type: `learnSlice/loadData/fulfilled`,
      payload: [
        {
          id: '1',
          text: 'item 1',
          translation: 'translation 1',
          invert: false,
          set: 'set_id_0',
          mode: 'flashcard' as const,
          progress: {
            eFactor: 2.5,
            interval: 0,
            intervalBeforeLearning: 0,
            phase: "learning" as const,
            nextRepetition: 1
          },
        },
        {
          id: '2',
          text: 'item 2',
          translation: 'translation 2',
          invert: false,
          set: 'set_id_0',
          mode: 'writing' as const,
          progress: {
            eFactor: 2.5,
            interval: 0,
            intervalBeforeLearning: 0,
            phase: "learning" as const,
            nextRepetition: 1
          },
        },
        {
          id: '3',
          text: 'item 3',
          translation: 'translation 3',
          invert: false,
          set: 'set_id_0',
          mode: 'information' as const,
          progress: {
            eFactor: 2.5,
            interval: 0,
            intervalBeforeLearning: 0,
            phase: "learning" as const,
            nextRepetition: 1
          },
        },
      ],
    })).toEqual({
      ...stateAfterLoad,
      progress: {
        mode: 'loading',
        state: 'success',
        message: ''
      }
    })
  });

  describe(`saveProgressInGame`, () => {
    it(`should set the inGameSavingProgress' state to 'loading' when the learning progress is sending to server`, () => {
      expect(learnReducer(undefined, {
        type: `learnSlice/saveProgressInGame/pending`,
        payload: undefined
      })).toEqual({
        ...DefaultState,
        inGameSavingProgress: {
          state: 'loading',
          message: 'Saving...'
        }
      })
    });
  
    it(`should set the inGameSavingProgress' state to 'error' when the sending progress operation failed`, () => {
      expect(learnReducer(undefined, {
        type: `learnSlice/saveProgressInGame/rejected`,
        payload: undefined
      })).toEqual({
        ...DefaultState,
        inGameSavingProgress: {
          state: 'error',
          message: 'There was an error. Please try again'
        }
      })
    });

    it(`should set state to 'done' when the sending progress operation was successful`, () => {
      expect(learnReducer(undefined, {
        type: `learnSlice/saveProgressInGame/fulfilled`,
        payload: undefined
      })).toEqual({
        ...DefaultState,
        inGameSavingProgress: {
          state: 'done',
          message: 'Save learning progress'
        }
      })
    });
  })

  describe(`updateItemProgress`, () => {
    it(`should update the item's progress`, () => {
      const result = learnReducer(state, {
        type: `learn/updateItemProgress`,
        payload: 0.5
      });

      expect(result).toEqual({
        ...state,
        items: [
          {
            ...state.items[0],
            progress: {
              eFactor: 2.5,
              interval: 1,
              intervalBeforeLearning: 0,
              phase: "learning" as const,
              nextRepetition: 1651774650727
            },
          },
          ...state.items.slice(1),
        ]
      });
    });

    it(`shouldn't update the item's progress if the item definition not exist`, () => {
      const result = learnReducer({ ...state, item: "" }, {
        type: `learn/updateItemProgress`,
        payload: 1
      });

      expect(result).toEqual({ ...state, item: "" });
    });
  });

  describe(`answer`, () => {
    it(`should move the item to the learning array if the item is in the remaining array`, () => {
      const result = learnReducer({ ...state }, {
        type: `learn/answer`,
        payload: undefined
      });

      expect(result).toEqual({ 
        ...state,
        done: ["4"],
        learning: ["5", "6", "7", "8", "1"],
        remaining: ["2", "3"],
      });
    })

    it(`should move the item to the end of the array if item is in the learning array`, () => {
      const result = learnReducer({ ...state, item: "5" }, {
        type: `learn/answer`,
        payload: undefined
      });

      expect(result).toEqual({ 
        ...state,
        item: "5",
        done: ["4"],
        learning: ["6", "7", "8", "5"],
        remaining: ["1", "2", "3"],
      });
    })

    it(`should move the item to the done array if the item's mode is information`, () => {
      const result = learnReducer({ ...state, item: "3" }, {
        type: `learn/answer`,
        payload: undefined
      });

      expect(result).toEqual({ 
        ...state,
        item: "3",
        done: ["4", "3"],
        learning: ["5", "6", "7", "8",],
        remaining: ["1", "2"],
      });
    })

    it(`should move the item to the done array if the next repetition of the element will be at the earliest tomorrow`, () => {
      const result = learnReducer({ ...state, item: "2" }, {
        type: `learn/answer`,
        payload: undefined
      });

      expect(result).toEqual({ 
        ...state,
        item: "2",
        done: ["4", "2"],
        learning: ["5", "6", "7", "8",],
        remaining: ["1", "3"],
      });
    })

    it(`shouldn't move the item if the item definition not exist`, () => {
      const result = learnReducer({ ...state, item: "" }, {
        type: `learn/answer`,
        payload: undefined
      });

      expect(result).toEqual({ ...state, item: "" });
    });
  });


  describe(`updateStatistics`, () => {
    it(`shouldn't update statistics if the item definition not exist`, () => {
      const result = learnReducer({ ...state, item: "" }, {
        type: `learn/updateStatistics`,
        payload: 0
      });

      expect(result).toEqual({ ...state, item: "" });
    });

    it(`shouldn't update statistics if the item's mode is information`, () => {
      const result = learnReducer({ ...state, item: "3" }, {
        type: `learn/updateStatistics`,
        payload: 0.25
      });

      expect(result).toEqual({ ...state, item: "3" });
    });

    it(`should create a new statistics item if the item is not in the statistics array`, () => {
      const result = learnReducer({ ...state }, {
        type: `learn/updateStatistics`,
        payload: 0
      });

      expect(result).toEqual({ 
        ...state, 
        statistics: {
          ...state.statistics,
          '1': {
            answers: [0],
            nextRepetition: 1
          }
        } 
      });
    });

    it(`should update a statistics item if the item is in the statistics array`, () => {
      const result = learnReducer({ ...state, item: '5' }, {
        type: `learn/updateStatistics`,
        payload: 0.78
      });

      expect(result).toEqual({ 
        ...state, 
        item: '5',
        statistics: {
          ...state.statistics,
          "5": {
            answers: [0, 0, 0.78],
            nextRepetition: 1,
          }
        } 
      });
    });
  });

  describe(`loadNextItem`, () => {
    beforeAll(() => {
      mockRandom(0.5);
    });
  
    afterAll(() => {
      resetMockRandom();
    });
  
    const testState = {
      ...state,
      getItemFrom: 'remaining' as const,
      item: '1',
      done: ['4', '1'],
      learning: ["5", "6", "7", "8"],
      remaining: ['2', '3'],
    }
  
    it(`should change the state's getItemsFrom to 'remaining' if the length of the state's learning array is lesser than 4`, () => {
      const result = learnReducer({ ...testState, getItemsFrom: "learning", learning: ["5", "6"] }, {
        type: `learn/loadNextItem`,
        payload: undefined
      });

      expect(result).toEqual({
        ...testState,
        getItemsFrom: 'remaining',
        learning: ["5", "6"],
        item: '2',
        itemIndex: 4,
        items: [
          testState.items[0],
          {
            ...testState.items[1],
            inGameId: '2--1',
          },
          ...testState.items.slice(2)
        ]
      });
    })

    it(`should change the state's getItemsFrom to 'learning' if the state's itemIndex is equal to 10`, () => {
      const result = learnReducer({ ...testState, itemIndex: 10 }, {
        type: `learn/loadNextItem`,
        payload: undefined
      });
  
      expect(result).toEqual({
        ...testState,
        getItemsFrom: 'learning',
        itemIndex: 10,
        item: '6',
        items: [
          ...testState.items.slice(0, 5),
          {
            ...testState.items[5],
            inGameId: "6--1",
          },
          ...testState.items.slice(6),
        ]
      });
    })

    it(`should change the state's getItemsFrom to 'learning' if the state's remaining array is empty`, () => {
      const result = learnReducer({ ...testState, remaining: [] }, {
        type: `learn/loadNextItem`,
        payload: undefined
      });

      expect(result).toEqual({
        ...testState,
        getItemsFrom: 'learning',
        itemIndex: 0,
        item: '6',
        remaining: [],
        items: [
          ...testState.items.slice(0, 5),
          {
            ...testState.items[5],
            inGameId: "6--1",
          },
          ...testState.items.slice(6),
        ]
      });
    })

    it(`should load the next item from the remaining array`, () => {
      const result = learnReducer(testState, {
        type: `learn/loadNextItem`,
        payload: undefined
      });

      expect(result).toEqual({
        ...testState,
        itemIndex: 1,
        item: '2',
        items: [
          testState.items[0],
          {
            ...testState.items[1],
            inGameId: '2--1',
          },
          ...testState.items.slice(2),
        ]
      });
    });

    it(`should load an item from the learning array if the state's getItemsFrom is set to 'learning'`, () => {
      const result = learnReducer({ ...testState, getItemsFrom: 'learning' }, {
        type: `learn/loadNextItem`,
        payload: undefined
      });

      expect(result).toEqual({
        ...testState,
        getItemsFrom: 'learning',
        itemIndex: 0,
        item: '6',
        items: [
          ...testState.items.slice(0, 5),
          {
            ...testState.items[5],
            inGameId: '6--1',
          },
          ...testState.items.slice(6),
        ]
      });
    });

    it(`should load the next item from the remaining array if the state's getItemsFrom is set to 'learning' and the learning array is empty`, () => {
      const result = learnReducer({ ...testState, getItemsFrom: 'learning', learning: [] }, {
        type: `learn/loadNextItem`,
        payload: undefined
      });

      expect(result).toEqual({
        ...testState,
        getItemsFrom: 'remaining',
        learning: [],
        itemIndex: 4,
        item: '2',
        items: [
          testState.items[0],
          {
            ...testState.items[1],
            inGameId: '2--1',
          },
          ...testState.items.slice(2),
        ]
      });
    });

    it(`should set the progress to 'done' if the remaining array and the learning array are empty`, () => {
      const result = learnReducer({ ...testState, remaining: [], learning: [] }, {
        type: `learn/loadNextItem`,
        payload: undefined
      });

      expect(result).toEqual({
        ...testState,
        itemIndex: 1,
        item: '1',
        remaining: [],
        learning: [],
        progress: {
          mode: 'done',
          message: '',
          state: 'success'
        },
      });
    })
  });
});

describe(`learn/loadData`, () => {
  let putSpy: jest.SpyInstance;
  const dispatch: any = () => {};
  const getState: any = () => {};

  beforeAll(() => {
    putSpy = jest.spyOn(axios, 'get');
  });

  beforeEach(() => {
    putSpy.mockClear();
  });

  afterAll(() => {
    putSpy.mockRestore();
  });
  
  it(`should return the loaded data`, async () => {
    putSpy.mockResolvedValue({
      status: 200,
      data: 'loaded data'
    });

    const result = await loadData()(dispatch, getState, {});

    expect(result).toEqual({
      type: `learnSlice/loadData/fulfilled`,
      payload: 'loaded data',
      meta: expect.any(Object)
    });
  });

  it(`should throw an error if the status of the response is other than 200`, async () => {
    putSpy.mockRejectedValue({ status: 500 });

    const result = await loadData()(dispatch, getState, {});
    expect(result.type).toEqual('learnSlice/loadData/rejected');
  });
});

describe(`learn/saveProgress`, () => {
  let putSpy: jest.SpyInstance;
  const dispatch: any = () => {};
  const getState: any = () => ({ learn: stateAfterLoad });

  beforeAll(() => {
    putSpy = jest.spyOn(axios, 'put');
  });

  beforeEach(() => {
    putSpy.mockClear();
  });

  afterAll(() => {
    putSpy.mockRestore();
  });
  
  it(`should send the state data`, async () => {
    putSpy.mockResolvedValue({
      status: 200,
      message: 'success'
    });

    const result = await saveProgress()(dispatch, getState, {});

    expect(putSpy).toBeCalledWith(`/api/v1/words/daily-list`, {
      data: [
        {
          id: '1',
          mode: 'flashcard',
          progress: {
            eFactor: 2.5,
            interval: 0,
            intervalBeforeLearning: 0,
            phase: "learning",
            nextRepetition: 1
          },
        },
        {
          id: '2',
          mode: 'writing',
          progress: {
            eFactor: 2.5,
            interval: 0,
            intervalBeforeLearning: 0,
            phase: "learning",
            nextRepetition: 1
          },
        },
        {
          id: '3',
          mode: 'information',
          progress: {
            eFactor: 2.5,
            interval: 0,
            intervalBeforeLearning: 0,
            phase: "learning",
            nextRepetition: 1
          },
        },
      ]
    });

    expect(result).toEqual({
      type: `learnSlice/saveProgress/fulfilled`,
      payload: undefined,
      meta: expect.any(Object)
    });
  });

  it(`should throw an error if the status of the response is other than 200`, async () => {
    putSpy.mockRejectedValue({ status: 500 });

    const result = await saveProgress()(dispatch, getState, {});
    expect(result.type).toEqual('learnSlice/saveProgress/rejected');
  });
});

describe(`learn/saveProgressInGame`, () => {
  let putSpy: jest.SpyInstance;
  const dispatch: any = () => {};
  const getState: any = () => ({ learn: stateAfterLoad });

  beforeAll(() => {
    putSpy = jest.spyOn(axios, 'put');
  });

  beforeEach(() => {
    putSpy.mockClear();
  });

  afterAll(() => {
    putSpy.mockRestore();
  });
  
  it(`should send the state data`, async () => {
    putSpy.mockResolvedValue({
      status: 200,
      message: 'success'
    });

    const result = await saveProgressInGame()(dispatch, getState, {});

    expect(putSpy).toBeCalledWith(`/api/v1/words/daily-list`, {
      data: [
        {
          id: '1',
          mode: 'flashcard',
          progress: {
            eFactor: 2.5,
            interval: 0,
            intervalBeforeLearning: 0,
            phase: "learning",
            nextRepetition: 1
          },
        },
        {
          id: '2',
          mode: 'writing',
          progress: {
            eFactor: 2.5,
            interval: 0,
            intervalBeforeLearning: 0,
            phase: "learning",
            nextRepetition: 1
          },
        },
        {
          id: '3',
          mode: 'information',
          progress: {
            eFactor: 2.5,
            interval: 0,
            intervalBeforeLearning: 0,
            phase: "learning",
            nextRepetition: 1
          },
        },
      ]
    });

    expect(result).toEqual({
      type: `learnSlice/saveProgressInGame/fulfilled`,
      payload: undefined,
      meta: expect.any(Object)
    });
  });

  it(`should throw an error if the status of the response is other than 200`, async () => {
    putSpy.mockRejectedValue({ status: 500 });

    const result = await saveProgressInGame()(dispatch, getState, {});
    expect(result.type).toEqual('learnSlice/saveProgressInGame/rejected');
  });
});

describe(`gameSlice/answer`, () => {
  const dispatchSpy = jest.fn();
  const getState: any = () => {};

  beforeEach(() => {
    dispatchSpy.mockClear();
  });

  it(`should dispatch the updateItemProgress action`, () => {
    answer(0.3)(dispatchSpy, getState, {});

    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: `learn/updateItemProgress`,
      payload: 0.3,
    });
  });

  it(`should dispatch the answer action`, () => {
    answer(0.3)(dispatchSpy, getState, {});

    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      type: `learn/answer`,
      payload: undefined,
    });
  });

  it(`should dispatch the updateStatistics action`, () => {
    answer(0.9)(dispatchSpy, getState, {});

    expect(dispatchSpy).toHaveBeenNthCalledWith(4, {
      type: `learn/updateStatistics`,
      payload: 0.9,
    });
  });

  it(`should dispatch the loadNextItem action`, () => {
    answer(0.3)(dispatchSpy, getState, {});

    expect(dispatchSpy).toHaveBeenNthCalledWith(5, {
      type: `learn/loadNextItem`,
      payload: undefined,
    });
  });
})