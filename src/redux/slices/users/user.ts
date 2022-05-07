import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  name: string;
  loginPage: boolean;
  sync: boolean;
  pageBefore404?: string;
}

const DefaultState: State = {
  name: 'Anonym',
  loginPage: true,
  pageBefore404: undefined,
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

    openLoginPage: (state) => {
      state.loginPage = true;
    },

    hideLoginPage: (state) => {
      state.loginPage = false;
    },

    setPageBefore404: (state, action: PayloadAction<string | undefined>) => {
      state.pageBefore404 = action.payload;
    }
  }
});

export const userReducer = userSlice.reducer;
export const { setUserData, openLoginPage, hideLoginPage, setPageBefore404 } = userSlice.actions;
