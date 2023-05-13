import { createSlice, createAsyncThunk, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchData } from '../../../api/fetchData';
import { superMemo } from '../../../super-memo/super-memo';
import { LearnItem, LoadResult } from './learn.types';
import { Language } from '../edit-set/edit-set.type';

type State = {
  inGameSavingProgress: {
    state: 'loading' | 'error' | 'done';
    message: string;
  },
  progress: {
    mode: 'saving' | 'loading' | 'done';
    state: 'loading' | 'error' | 'empty' | 'success';
    message: string;
  };
  items: LearnItem[];
  done: string[];
  learning: string[];
  remaining: string[];
  
  itemIndex: number;
  getItemsFrom: 'learning' | 'remaining';
  item: string;
  languages: Language[],
  statistics: { 
    [item: string]: {
      answers: (number)[];
      nextRepetition: number;
    }
  };
}

type ThunkConfig = {
  dispatch: Dispatch,
  state: { 
    learn: State
  },
}

const DefaultState: State = {
  inGameSavingProgress: {
    state: 'done',
    message: 'Save learning progress'
  },
  progress: {
    mode: 'loading',
    state: 'loading',
    message: ''
  },
  items: [],
  done: [],
  learning: [],
  remaining: [],
  itemIndex: 0,
  getItemsFrom: 'remaining',
  item: '',
  languages: [],
  statistics: {}
}

export const loadData = createAsyncThunk<LoadResult, undefined, ThunkConfig>(
  'learnSlice/loadData',
  async (_, thunk) => {
    const res = await fetchData(() => axios.get(`/api/v1/words/daily-list`), thunk.dispatch);
    
    if (res.status === 200) {
      return res.data;
    }

    throw new Error('Failed to fetch data');
  }
)

export const saveProgress = createAsyncThunk<void, undefined, ThunkConfig>(
  'learnSlice/saveProgress',
  async (_, thunk) => {
    const data = thunk.getState().learn.items.map(item => ({
      id: item.id,
      progress: item.progress,
      mode: item.mode,
    }));

    const res = await fetchData(() => axios.put(`/api/v1/words/daily-list`, { data }), thunk.dispatch);
    
    if (res.status !== 200) {
      throw new Error('Operation failed');
    }
  }
)

export const saveProgressInGame = createAsyncThunk<void, undefined, ThunkConfig>(
  'learnSlice/saveProgressInGame',
  async (_, thunk) => {
    const data = thunk.getState().learn.items.map(item => ({
      id: item.id,
      progress: item.progress,
      mode: item.mode,
    }));

    const res = await fetchData(() => axios.put(`/api/v1/words/daily-list`, { data }), thunk.dispatch);
    
    if (res.status !== 200) {
      throw new Error('Operation failed');
    }
  }
)

export const answer = createAsyncThunk<void, number, ThunkConfig>(
  'learnSlice/answer',
  async (payload, action) => {
    const { dispatch } = action;

    dispatch(learnSlice.actions.updateItemProgress(payload));
    dispatch(learnSlice.actions.answer());
    dispatch(learnSlice.actions.updateStatistics(payload));
    dispatch(learnSlice.actions.loadNextItem());
  }
);

const learnSlice = createSlice({
  name:'learn',
  initialState: DefaultState,
  reducers: {
    updateItemProgress: (state, action: PayloadAction<number>) => {
      const data = state.items.find(item => item.id === state.item);

      if (data) {
        const min = 0;
        const max = 3;

        const value = Math.floor(action.payload * (max - min)) + min;
        data.progress = superMemo(data.progress, value as 0 | 1 | 2 | 3);
      }
    },

    answer: (state) => {
      const { item } = state;
      const wasLearning = state.learning.some(learning => learning === item);
      const data = state.items.find(item => item.id === state.item);
      const today = new Date().setHours(23, 59, 59, 999);

      if (!data) {
        return;
      }

      if (wasLearning) {
        state.learning = state.learning.filter(learning => learning !== item);
      }
      else {
        state.remaining = state.remaining.filter(remaining => remaining !== item);
      }

      if (data.progress.nextRepetition > today || data.mode === 'information') {
        state.done.push(item);
        return;
      }
      else {
        state.learning.push(item);
      }
    },

    updateStatistics: (state, action: PayloadAction<number>) => {
      const { item } = state;
      const data = state.items.find(item => item.id === state.item);

      if (!data || data.mode === 'information') {
        return;
      }

      if (state.statistics[item] === undefined) {
        state.statistics[item] = {
          answers: [action.payload],
          nextRepetition: data.progress.nextRepetition
        }
      }
      else {
        state.statistics[item] = {
          answers: [...state.statistics[item].answers, action.payload],
          nextRepetition: data.progress.nextRepetition
        }
      }
    },

    loadNextItem(state) {
      const numberOfWordInBetweenModes = 10;

      let value: string | undefined = undefined;

      if (state.getItemsFrom === 'learning' && state.learning.length <= 3) {
        state.getItemsFrom = 'remaining';
        state.itemIndex = 3;
      }

      if (state.itemIndex >= numberOfWordInBetweenModes || state.remaining.length === 0) {
        state.getItemsFrom = 'learning';
      }

      if (state.getItemsFrom === 'learning') {
        value = state.learning[Math.floor(Math.random() * Math.max(state.learning.length-1, 0))];

        if (!value) {
          state.getItemsFrom = 'remaining';
          state.itemIndex = 0;
        }
      }

      if (!value) { 
        value = state.remaining[0];
        state.itemIndex += 1;
      }
    
      if (value) {
        const index = state.items.findIndex(item => item.id === value);
        const [id, repetition] = state.items[index].inGameId.split('--');

        state.items[index].inGameId = `${id}--${parseInt(repetition, 10) + 1}`;
        state.item = value;
      }
      else {
        state.progress.mode = 'done';
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(saveProgress.pending, (state) => {
      state.progress = {
        mode: 'saving',
        state: 'loading',
        message: ''
      }
    });

    builder.addCase(saveProgress.rejected, (state) => {
      state.progress = {
        mode: 'saving',
        state: 'error',
        message: 'There was an error. Please try again'
      }
    });

    builder.addCase(saveProgress.fulfilled, (state) => {
      state.progress = {
        mode: 'saving',
        state: 'success',
        message: ''
      }
    });

    builder.addCase(saveProgressInGame.pending, (state) => {
      state.inGameSavingProgress = {
        state: 'loading',
        message: 'Saving...'
      }
    });

    builder.addCase(saveProgressInGame.rejected, (state) => {
      state.inGameSavingProgress = {
        state: 'error',
        message: 'There was an error. Please try again'
      }
    });

    builder.addCase(saveProgressInGame.fulfilled, (state) => {
      state.inGameSavingProgress = {
        state: 'done',
        message: 'Save learning progress'
      }
    });

    builder.addCase(loadData.pending, (state) => {
      state.progress = {
        mode: 'loading',
        state: 'loading',
        message: ''
      };
    });

    builder.addCase(loadData.rejected, (state) => {
      state.progress = {
        mode: 'loading',
        state: 'error',
        message: 'There was an error. Please try again'
      };
    });

    builder.addCase(loadData.fulfilled, (state, action) => {
      if (action.payload.cards.length === 0) {
        state.progress = {
          mode: 'loading',
          state: 'empty',
          message: 'There is nothing to learn for today, please try again tomorrow or add some words'
        }
        
        return;
      }
      
      state.progress = {
        mode: 'loading',
        state: 'success',
        message: ''
      };

      state.items = action.payload.cards.map(item => ({ ...item, inGameId: `${item.id}--0` }));
      state.remaining = action.payload.cards.map(item => item.id);
      state.languages = action.payload.languages;
      state.done = [];
      
      state.item = state.items[0].id;
      state.itemIndex = 0;
      state.getItemsFrom = 'remaining';
      state.statistics = {};
    });
  },
});

export const learnReducer = learnSlice.reducer;