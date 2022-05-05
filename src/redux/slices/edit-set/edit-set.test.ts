import axios from 'axios';
import { editSetReducer, createSet, editSet } from "./edit-set";
import { WordDataConstructor } from "./edit-set.type";

const state = {
  id: undefined,
  title: 'New set',
  isProtected: false,
  words: [
    {
      id: "0_1",
      type: 'create' as const,
      word: 'word 1',
      meaning: 'meaning 1',
      firstExample: {
        example: 'example 1',
        translation: 'translation 1',
      },
      error: {}
    },
    {
      id: "0_2",
      type: 'import' as const,
      word: 'word 2',
      meaning: 'meaning 2',
      firstExample: {
        example: 'example 2',
        translation: 'translation 2',
      },
      error: {}
    },
    {
      id: "0_3",
      type: 'edit' as const,
      word: 'word 3',
      meaning: 'meaning 3',
      firstExample: {
        example: 'example 3',
        translation: 'translation 3',
      },
      error: {}
    },
  ],
  progress: {
    mode: 'loading' as const,
    state: 'loading' as const,
    message: ''
  },
}

describe(`editSetSlice`, () => {
  describe(`default state`, () => {
    it(`should set the default state`, () => {
      expect(editSetReducer(undefined, { type: `@@INIT` })).toEqual({
        id: undefined,
        title: 'New set',
        words: [],
        isProtected: false,
        progress: {
          mode: 'loading',
          state: 'success',
          message: '',
        },
      });
    });

    describe(`setTitle`, () => {
      it(`should set the title`, () => {
        expect(editSetReducer(undefined, { type: `editSet/setTitle`, payload: `new title` })).toEqual({
          id: undefined,
          title: `new title`,
          words: [],
          isProtected: false,
          progress: {
            mode: 'loading',
            state: 'success',
            message: '',
          },
        });
      });
    });

    describe(`addWord`, () => {
      it(`should add a word to the state`, () => {
        const word: WordDataConstructor = {
          type: 'create',
          word: 'word',
          meaning: 'meaning',
          firstExample: {
            example: 'example',
            translation: 'translation',
          },
          error: {}
        }

        expect(editSetReducer(undefined, { type: `editSet/addWord`, payload: word })).toEqual({
          id: undefined,
          title: 'New set',
          isProtected: false,
          words: [{
            id: expect.any(String),
            type: 'create',
            word: 'word',
            meaning: 'meaning',
            firstExample: {
              example: 'example',
              translation: 'translation',
            },
            error: {}
          }],
          progress: {
            mode: 'loading',
            state: 'success',
            message: '',
          },
        });
      });
    });

    describe(`removeWord`, () => {
      it(`should remove a word from the state`, () => {
        expect(editSetReducer(state, { type: `editSet/removeWord`, payload: '0_2' })).toEqual({
          id: undefined,
          title: 'New set',
          isProtected: false,
          words: [
            {
              id: "0_1",
              type: 'create' as const,
              word: 'word 1',
              meaning: 'meaning 1',
              firstExample: {
                example: 'example 1',
                translation: 'translation 1',
              },
              error: {}
            },
            {
              id: "0_3",
              type: 'edit' as const,
              word: 'word 3',
              meaning: 'meaning 3',
              firstExample: {
                example: 'example 3',
                translation: 'translation 3',
              },
              error: {}
            }
          ],
          progress: {
            mode: 'loading',
            state: 'loading',
            message: '',
          },
        });
      });
    });

    describe(`editWord`, () => {
      it(`shouldn't change the state if the word from the payload not exist in the state`, () => {
        expect(editSetReducer(state, { type: `editSet/editWord`, payload: { id: '0_4', word: 'word 4' } })).toEqual(state);
      });

      it(`should modify the word in the state`, () => {
        const word = {
          id: "0_2",
          type: 'edit' as const,
          word: 'edited word',
          meaning: 'edited meaning',
          firstExample: undefined,
          secondExample: {
            example: 'example 4',
            translation: 'translation 4',
          }
        };

        expect(editSetReducer(state, { type: `editSet/editWord`, payload: word })).toEqual({
          ...state,
          words: [
            ...state.words.filter(w => w.id !== '0_2'),
            {
              id: "0_2",
              type: 'edit' as const,
              word: 'edited word',
              meaning: 'edited meaning',
              firstExample: undefined,
              secondExample: {
                example: 'example 4',
                translation: 'translation 4',
              },
              error: {}
            } 
          ].sort((a, b) => a.id.localeCompare(b.id))
        });
      });

      it(`should add errors to the word if the word is invalid`, () => {
        const word = {
          id: "0_2",
          type: 'edit' as const,
          word: '',
          meaning: 'edited meaning',
          firstExample: undefined,
          secondExample: {
            example: 'example 4',
            translation: 'translation 4',
          }
        };

        expect(editSetReducer(state, { type: `editSet/editWord`, payload: word })).toEqual({
          ...state,
          words: [
            ...state.words.filter(w => w.id !== '0_2'),
            {
              id: "0_2",
              type: 'edit' as const,
              word: '',
              meaning: 'edited meaning',
              firstExample: undefined,
              secondExample: {
                example: 'example 4',
                translation: 'translation 4',
              },
              error: {
                word: 'This filed is required.'
              }
            }
          ].sort((a, b) => a.id.localeCompare(b.id))
        });
      });
    });

    describe(`clear`, () => {
      it(`should clear the state`, () => {
        expect(editSetReducer(state, { type: `editSet/clear` })).toEqual({
          id: undefined,
          title: 'New set',
          isProtected: false, 
          words: [],
          progress: {
            mode: 'loading',
            state: 'success',
            message: '',
          },
        });
      });
    });

    describe(`createSet`, () => {
      it(`should set the progress to loading`, () => {
        expect(editSetReducer(state, { type: `editSet/createSet/pending` })).toEqual({
          ...state,
          progress: {
            mode: 'saving',
            state: 'loading',
            message: '',
          },
        });
      });

      it(`should set the progress to error`, () => {
        expect(editSetReducer(state, { type: `editSet/createSet/rejected` })).toEqual({
          ...state,
          progress: {
            mode: 'saving',
            state: 'error',
            message: 'There was an error. Please try again',
          },
        });
      });

      it(`should set the progress to success`, () => {
        expect(editSetReducer(state, { type: `editSet/createSet/fulfilled` })).toEqual({
          ...state,
          progress: {
            mode: 'saving',
            state: 'success',
            message: '',
          }
        });
      });
    });

    describe(`editSet`, () => {
      const fetchedState = {
        id: 'set_id',
        title: 'Loaded Set',
        protected: false,
        words: [
          {
            id: "0_6",
            type: 'import' as const,
            word: 'word 6',
            meaning: 'meaning 6',
            firstExample: {
              example: 'example 6',
              translation: 'translation 6',
            },
            error: {}
          },
        ],
      }
      
      it(`should set the progress to loading`, () => {
        expect(editSetReducer(state, { type: `editSet/editSet/pending` })).toEqual({
          ...state,
          progress: {
            mode: 'loading',
            state: 'loading',
            message: '',
          },
        });
      });

      it(`should set the progress to error`, () => {
        expect(editSetReducer(state, { type: `editSet/editSet/rejected` })).toEqual({
          ...state,
          progress: {
            mode: 'loading',
            state: 'error',
            message: 'There was an error. Please try again',
          },
        });
      });

      it(`should set the progress to success and load an set data to the state`, () => {
        expect(editSetReducer(state, { type: `editSet/editSet/fulfilled`, payload: fetchedState })).toEqual({
          ...state,
          progress: {
            mode: 'loading',
            state: 'success',
            message: '',
          },
          id: 'set_id',
          title: 'Loaded Set',
          isProtected: false,
          words: [
            {
              id: "0_6",
              type: 'import' as const,
              word: 'word 6',
              meaning: 'meaning 6',
              firstExample: {
                example: 'example 6',
                translation: 'translation 6',
              },
              secondExample: undefined,
              usedIn: undefined,
              error: {}
            },
          ],
        });
      });
    });
  });
})

describe(`editSet`, () => {
  let axiosGet: jest.SpyInstance;

  beforeAll(() => {
    axiosGet = jest.spyOn(axios, 'get');
  });

  beforeEach(() => {
    axiosGet.mockClear();
  });

  afterAll(() => {
    axiosGet.mockRestore();
  });

  it(`should fetch the set's data and return them`, async () => {
    axiosGet.mockResolvedValue({ status: 200, data: "test data" });

    const result = await editSet("set_id")((() => {}) as any, () => ({} as any), {});

    expect(axiosGet).toHaveBeenCalledWith(`/api/v1/sets/set_id`);
    expect(result.type).toEqual('editSet/editSet/fulfilled');
    expect(result.payload).toEqual("test data");
  });

  it(`should return an error if the fetch fails`, async () => {
    axiosGet.mockRejectedValue({ status: 500 });

    const result = await editSet("set_id")((() => {}) as any, () => ({} as any), {});

    expect(axiosGet).toHaveBeenCalledWith(`/api/v1/sets/set_id`);
    expect(result.type).toEqual('editSet/editSet/rejected');
  });
});

describe(`createSet`, () => {
  const state = {
    editSet: {
      id: undefined,
      title: 'New set',
      words: [
        {
          id: "0_1",
          type: 'create' as const,
          word: 'word 1',
          meaning: 'meaning 1',
          firstExample: {
            example: 'example 1',
            translation: 'translation 1',
          },
          error: {}
        },
        {
          id: "0_2",
          type: 'edit' as const,
          word: 'meaning 2',
          meaning: 'meaning 2',
          secondExample: {
            example: 'example 2',
            translation: 'translation 2',
          },
        },
        {
          id: "0_3",
          type: 'import' as const,
          word: 'meaning 3',
          meaning: 'meaning 3',
          firstExample: {
            example: 'example 3',
            translation: 'translation 3',
          },
          secondExample: {
            example: 'example 4',
            translation: 'translation 4',
          },
        },
      ],
      progress: {
        mode: 'loading' as const,
        state: 'loading' as const,
        message: ''
      },
    }
  } as any;

  let axiosPost: jest.SpyInstance;
  let axiosPut: jest.SpyInstance;

  beforeAll(() => {
    axiosPost = jest.spyOn(axios, 'post');
    axiosPut = jest.spyOn(axios, 'put');
  });

  beforeEach(() => {
    axiosPost.mockClear();
    axiosPut.mockClear();

    axiosPost.mockResolvedValue({ status: 201 });
    axiosPut.mockResolvedValue({ status: 200 });
  });

  afterAll(() => {
    axiosPost.mockRestore();
    axiosPut.mockRestore();
  });

  it(`should convert words from the array according to their type`, async () => {
    const result = await createSet()(() => ({} as any), () => state as any, {});

    expect(axiosPost).toHaveBeenCalledWith(`/api/v1/sets`, {
      data: {
        title: 'New set',
        words: [
          {
            word: 'word 1',
            meaning: 'meaning 1',
            firstExample: {
              example: 'example 1',
              translation: 'translation 1',
            },
          },
          {
            id: '0_2',
            word: 'meaning 2',
            meaning: 'meaning 2',
            secondExample: {
              example: 'example 2',
              translation: 'translation 2',
            },
          },
          "0_3",
        ]
      }
    });

    expect(result.type).toEqual('editSet/createSet/fulfilled');
  });

  it(`should throw an error if state contains an error`, async () => {
    const state = {
      editSet: {
        id: undefined,
        title: 'New set',
        words: [
          {
            id: "0_1",
            type: 'create' as const,
            word: '',
            meaning: 'meaning 1',
            error: {
              word: 'This field is required',
            }
          }
        ]
      }
    } as any;

    const result = await createSet()(() => ({} as any), () => state as any, {});
  
    expect(result.type).toEqual('editSet/createSet/rejected');
  });

  it(`should throw an error if the fetch fails`, async () => {
    axiosPost.mockRejectedValue({ status: 500 });

    const result = await createSet()(() => ({} as any), () => state as any, {});
    expect(result.type).toEqual('editSet/createSet/rejected');
  });

  it(`should do a put request if the state id is defined`, async () => {
    const state = {
      editSet: {
        id: "set_id",
        title: 'New set',
        words: [
          {
            id: "0_1",
            type: 'import' as const,
            word: 'word 1',
            meaning: 'meaning 1',
            error: {},
          },
        ]
      }
    } as any;

    const result = await createSet()(() => ({} as any), () => state as any, {
      id: "set_id",
      title: 'New set',
      words: [ "0_1" ]
    });
    
    expect(axiosPut).toHaveBeenCalledWith(`/api/v1/sets/set_id`, {
      data: {
        id: "set_id",
        title: 'New set',
        words: [ "0_1" ]
      }
    });
    expect(result.type).toEqual('editSet/createSet/fulfilled');
  });


  it(`should do a post request if the state id isn't defined`, async () => {
    const state = {
      editSet: {
        id: undefined,
        title: 'New set',
        words: [
          {
            id: "0_1",
            type: 'import' as const,
            word: 'word 1',
            meaning: 'meaning 1',
            error: {},
          },
        ]
      }
    } as any;

    const result = await createSet()(() => ({} as any), () => state as any, {});
    
    expect(axiosPost).toHaveBeenCalledWith(`/api/v1/sets`, {
      data: {
        title: 'New set',
        words: [ "0_1" ]
      }
    });
    expect(result.type).toEqual('editSet/createSet/fulfilled');
  });
});