import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const DefaultState = {
  name: 'Anonym',
  loginPage: true,
  sync: false,
}

type State = typeof DefaultState;

const userSlice = createSlice({
  name: 'user',
  initialState: DefaultState,
  reducers: {
    setUserData: (state, action: PayloadAction<Omit<State, "loginPage">>) => {
      state.name = action.payload.name;
      state.sync = action.payload.sync;
    },

    openLoginPage: (state) => {
      state.loginPage = true;
    },

    hideLoginPage: (state) => {
      state.loginPage = false;
    }
  }
});

export const userReducer = userSlice.reducer;
export const { setUserData, openLoginPage, hideLoginPage } = userSlice.actions;
