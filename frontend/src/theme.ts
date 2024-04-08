import { createTheme } from "@mui/material";

export const themeConstructor = {
  palette: {
    primary: {
      light: '#f0956e',
      main: '#ba6642',
      dark: '#863a17',
      contrastText: '#fff',
    },
  },
  shape: {
    borderRadius: 25,
  }  
}

export const theme = createTheme(themeConstructor);

export type Theme = typeof theme;