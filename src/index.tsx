import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from 'react-redux';
import { store, useAppSelector } from './redux/store';
import { Authentication } from './pages/authentication/authentication';
import { MuiThemeProvider } from '@material-ui/core';
import { theme } from './theme';

const App = () => {
  const openLoginPage = useAppSelector(({ user }) => user.loginPage);

  return openLoginPage ? (
    <Authentication />
  ) : (
    <BrowserRouter>
      <Routes>
        <Route 
          path='/' 
          element={<>App</>}
        />
      </Routes>
    </BrowserRouter>
  );
} 

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
