import { Theme } from "@mui/material";
import { getColor } from "./get-color";

const theme = {
  palette: {
    primary: {
      main: '#000',
      text: '#fff',
    },
  },
} as unknown as Theme;

describe('getColor', () => {
  it(`should return the color's variant from the theme`, () => {
    expect(getColor(theme, 'primary.text')).toBe('#fff');
  });

  it(`should return the main variant of the color from the theme if the color parameter is defined without a variant`, () => {
    expect(getColor(theme, 'primary')).toBe('#000');
  });

  it(`should return the color if the color parameter is not defined in the theme`, () => {
    expect(getColor(theme, '#0f0')).toBe('#0f0');
  });

  it(`should return the color parameter if the color's variant if not defined in the theme`, () => {
    expect(getColor(theme, 'primary.red')).toBe('primary.red');
  });
}); 