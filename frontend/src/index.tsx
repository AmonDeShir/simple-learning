import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { App } from './app';

ReactDOM.render(
  //<React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>,
  //</React.StrictMode>,
  document.getElementById('root')
);
