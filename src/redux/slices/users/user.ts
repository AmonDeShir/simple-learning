import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const DefaultState = {
  name: 'Anonym',
  email: '',
  synchronize: false,
  loginPage: true,
}

type State = typeof DefaultState;

const userSlice = createSlice({
  name: 'user',
  initialState: DefaultState,
  reducers: {
    setUserData: (state, action: PayloadAction<Omit<State, "loginPage">>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.synchronize = action.payload.synchronize;
    },

    openLoginPage: (state) => {
      state.loginPage = true;
    },

    hideLoginPage: (state) => {
      state.loginPage = false;
    }
  }
});

const userReducer = userSlice.reducer;

export const { setUserData, openLoginPage, hideLoginPage } = userSlice.actions;
export default userReducer;