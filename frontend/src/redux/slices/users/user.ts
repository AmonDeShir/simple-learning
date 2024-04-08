import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  name?: string;
  sync: boolean;
}

const DefaultState: State = {
  name: undefined,
  sync: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState: DefaultState,
  reducers: {
    setUserData: (state, action: PayloadAction<Omit<State, "loginPage">>) => {
      state.name = action.payload.name;
      state.sync = action.payload.sync;
    },
  }
});

export const userReducer = userSlice.reducer;
export const { setUserData } = userSlice.actions;
