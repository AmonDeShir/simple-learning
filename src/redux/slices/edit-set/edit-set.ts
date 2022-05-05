import { createSlice, PayloadAction, nanoid, createAsyncThunk, Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchData } from '../../../api/fetchData';
import { WordData, WordDataConstructor, SetData, requiredFields } from './edit-set.type';

type State = {
  id?: string;
  title: string;
  words: WordData[];
  isProtected: boolean;
  progress: {
    mode: 'saving' | 'loading';
    state: 'loading' | 'error' | 'success';
    message: string;
  };
}

type ThunkConfig = {
  dispatch: Dispatch,
  state: { 
    editSet: State
  },
}

const DefaultState: State = {
  id: undefined,
  title: 'New set',
  words: [],
  isProtected: false,
  progress: {
    mode: 'loading',
    state: 'loading',
    message: ''
  },
}

const convertExample = (example?: { example: string; translation: string }) => {
  if (!example || example.example === '' || example.translation === '') {
    return undefined;
  }

  return example;
}

const convertWord = (word: WordData) => {
  if (word.type === 'import') {
    return word.id;
  }

  if (word.type === 'create') {
    return {
      word: word.word,
      meaning: word.meaning,
      firstExample: convertExample(word.firstExample),
      secondExample: convertExample(word.secondExample),
    }
  }
  
  return {
    id: word.id,
    word: word.word,
    meaning: word.meaning,
    firstExample: convertExample(word.firstExample),
    secondExample: convertExample(word.secondExample),
  }
}

export const createSet = createAsyncThunk<void, undefined, ThunkConfig>(
  'editSet/createSet',
  async (_, thunk) => {
    const state = thunk.getState().editSet;
    const data = { 
      title: state.title,
      id: state.id,
      words: state.words.map(convertWord),
    };

    const hasErrors = state.words.every(({ error }) => Object.keys(error).length > 0);

    if (hasErrors) {
      throw new Error('Some definitions contain errors!')
    }
    
    let result: { status: number };

    if (state.id) {
      result = await fetchData(() => axios.put(`/api/v1/sets/${data.id}`, { data }), thunk.dispatch);
    }
    else {
      result = await fetchData(() => axios.post('/api/v1/sets', { data }), thunk.dispatch);
    }

    if (result.status !== 200 && result.status !== 201) {
      throw new Error('Operation failed');
    }
  }
)

export const editSet = createAsyncThunk<SetData, string, ThunkConfig>(
  'editSet/editSet',
  async (payload, thunk) => {
    const res = await fetchData(() => axios.get(`/api/v1/sets/${payload}`), thunk.dispatch);

    if (res.status === 200) {
      return res.data;
    }
    
    throw Error('Failed to fetch set');
  }
)

const editSetSlice = createSlice({
  name: 'editSet',
  initialState: DefaultState,
  reducers: {
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },

    addWord(state, action: PayloadAction<WordDataConstructor>) {
      state.words.push({ id: nanoid(), ...action.payload });
    },

    removeWord(state, action: PayloadAction<string>) {
      state.words = state.words.filter(word => word.id !== action.payload);
    },

    editWord(state, action: PayloadAction<WordData>) {
      const word = state.words.find(word => word.id === action.payload.id);
      
      if (!word) {
        return;
      }

      word.error = {};
      
      for(const filed of requiredFields) {
        if (action.payload[filed].length === 0) {
          word.error[filed] = 'This filed is required.'
        }
      }

      word.word = action.payload.word;
      word.meaning = action.payload.meaning;
      word.firstExample = action.payload.firstExample;
      word.secondExample = action.payload.secondExample;
      word.type = action.payload.type;
    },

    clear(state) {
      state.title = DefaultState.title;
      state.words = DefaultState.words;
      state.progress = DefaultState.progress;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createSet.pending, (state) => {
      state.progress = {
        mode: 'saving',
        state: 'loading',
        message: ''
      }
    });

    builder.addCase(createSet.rejected, (state) => {
      state.progress = {
        mode: 'saving',
        state: 'error',
        message: 'There was an error. Please try again'
      }
    });

    builder.addCase(createSet.fulfilled, (state) => {
      state.progress = {
        mode: 'saving',
        state: 'success',
        message: ''
      }
    });

    builder.addCase(editSet.pending, (state) => {
      state.progress = {
        mode: 'loading',
        state: 'loading',
        message: ''
      };
    });

    builder.addCase(editSet.rejected, (state) => {
      state.progress = {
        mode: 'loading',
        state: 'error',
        message: 'There was an error. Please try again'
      };
    });

    builder.addCase(editSet.fulfilled, (state, action) => {
      state.progress = {
        mode: 'loading',
        state: 'success',
        message: ''
      };
      state.id = action.payload.id;
      state.title = action.payload.title;
      state.isProtected = action.payload.protected;
      state.words = action.payload.words.map(word => ({
        id: word.id,
        word: word.word,
        meaning: word.meaning,
        firstExample: word.firstExample,
        secondExample: word.secondExample,
        usedIn: word.usedIn,
        type: 'import',
        error: {},
      }));
    });
  },
});

export const editSetReducer = editSetSlice.reducer;

export const { setTitle, editWord, addWord, removeWord, clear } = editSetSlice.actions;
