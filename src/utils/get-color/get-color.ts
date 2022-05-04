import { Theme } from "@mui/material";

export function getColor(theme: Theme, color: string) {
  const [colorType, colorVariant = 'main'] = color.split('.');

  const value = theme.palette[colorType as 'primary']; 

  if (typeof value === 'object') {
    if (value[colorVariant as 'main']) {
      return value[colorVariant as 'main']
    }
  }

  return color;
}