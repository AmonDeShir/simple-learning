import { createTheme } from "@material-ui/core";

export const theme = createTheme({
  palette: {
    primary: {
      light: '#f0956e',
      main: '#ba6642',
      dark: '#863a17',
      contrastText: '#fff'
    },
  },
  shape: {
    borderRadius: 25,
  }
});
