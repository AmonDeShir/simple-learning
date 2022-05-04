import { createSlice, createAsyncThunk, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchData } from '../../../api/fetchData';
import { GameItem, GameType, LoadResult } from './game.type';

type State = {
  progress: 'idle' | 'loading-pending' | 'loading-success' | 'loading-error' | 'done';
  mode: GameType;
  setId: string;
  items: GameItem[];

  correct: string[];
  incorrect: string[];
  remaining: string[];
  item: string;
  itemIndex: number;
  getItemsFrom: 'incorrect' | 'remaining';
  statistics: {
    correct: GameItem[];
    incorrect: GameItem[];
    items: string[];
  }
}

type ThunkConfig = {
  dispatch: Dispatch,
  state: { 
    game: State
  },
}

const DefaultState: State = {
  progress: 'idle',
  mode: 'flashcards',
  setId: '',
  items: [],
  correct: [],
  incorrect: [],
  remaining: [],
  item: '',
  itemIndex: 0,
  getItemsFrom: 'remaining',
  statistics: {
    correct: [],
    incorrect: [],
    items: [],
  }
}

export const loadSet = createAsyncThunk<LoadResult, { id?: string, mode?: string }, ThunkConfig>(
  'gameSlice/loadSet',
  async (payload, thunk) => {
    if (!payload.id || !payload.mode) {
      throw new Error('Failed to fetch set');
    }
    
    const res = await fetchData(() => axios.get(`/api/v1/sets/game/${payload.id}/${payload.mode}`), thunk.dispatch);
    
    if (res.status === 200) {
      return res.data;
    }

    throw new Error('Failed to fetch set');
  }
)

export const answer = createAsyncThunk<void, boolean, ThunkConfig>(
  'gameSlice/answer',
  async (payload, action) => {
    const { dispatch } = action;

    if (payload) {
      dispatch(gameSlice.actions.answerCorrect());
    }
    else {
      dispatch(gameSlice.actions.answerIncorrect());
    }

    dispatch(gameSlice.actions.updateStatistics(payload));
    dispatch(gameSlice.actions.loadNextItem());
  }
);

const gameSlice = createSlice({
  name:'game',
  initialState: DefaultState,
  reducers: {
    answerCorrect: (state) => {
      const { item } = state;
      const wasIncorrect = state.incorrect.some(incorrect => incorrect === item);
      
      if (wasIncorrect) {
        const newPosition = Math.floor(Math.random() * state.remaining.length);

        state.incorrect = state.incorrect.filter(incorrect => incorrect !== item);
        state.remaining = [state.remaining.slice(0, newPosition), item, state.remaining.slice(newPosition)].flat();
      }
      else {
        state.remaining = state.remaining.filter(remaining => remaining !== item);
        state.correct.push(item);
      }
    },

    answerIncorrect: (state) => {
      const { item } = state;
      const wasIncorrect = state.incorrect.some(incorrect => incorrect === item);
      
      if (wasIncorrect) {
        state.incorrect = state.incorrect.filter(incorrect => incorrect !== item);
        state.incorrect.push(item);
      }
      else {
        state.remaining = state.remaining.filter(remaining => remaining !== item);
        state.incorrect.push(item);
      }
    },

    updateStatistics: (state, payload: PayloadAction<boolean>) => {
      const { item } = state;

      if (state.statistics.items.indexOf(item) === -1) {
        const data = state.items.find(item => item.id === state.item);

        if (data) {
          state.statistics.items.push(item);

          if (payload.payload) {
            state.statistics.correct.push(data)
          }
          else {
            state.statistics.incorrect.push(data)
          }
        }
      }
    },

    loadNextItem(state) {
      const numberOfWordInBetweenWrongs = 10;
      let value: string | undefined = undefined;

      if (state.itemIndex >= numberOfWordInBetweenWrongs || state.remaining.length === 0) {
        state.getItemsFrom = 'incorrect';
      }

      if (state.getItemsFrom === 'incorrect') {
        value = state.incorrect[Math.floor(Math.random() * Math.max(state.incorrect.length-1, 0))];
      
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
        state.progress = 'done';
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadSet.pending, (state) => {
      state.progress = 'loading-pending';
    });

    builder.addCase(loadSet.rejected, (state) => {
      state.progress = 'loading-error';
    });

    builder.addCase(loadSet.fulfilled, (state, action) => {
      state.progress = 'loading-success';
      state.mode = action.payload.mode;
      state.setId = action.payload.id;
      
      state.items = action.payload.items.map(item => ({ ...item, inGameId: `${item.id}--0` }));
      state.remaining = action.payload.items.map(item => item.id);
      state.correct = [];
      state.incorrect = [];
      
      state.item = state.items[0]?.id ?? '';
      state.itemIndex = 0;
      state.getItemsFrom = 'remaining';
      state.statistics = {
        correct: [],
        incorrect: [],
        items: [],
      };
    });
  },
});

export const gameReducer = gameSlice.reducer;