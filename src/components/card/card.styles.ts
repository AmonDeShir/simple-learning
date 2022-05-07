import { Box, Card, CardContent, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import emotionStyled from '@emotion/styled';

export const StyledCardContent = styled(CardContent)`
  padding: 0;
`;

export const Header = styled(Box)<{invert?: boolean}>`
  background-color: ${({ theme, invert }) => invert ? theme.palette.background.paper : theme.palette.primary.main };
  border: ${({ theme }) => `3px solid ${theme.palette.primary.main}`};
  width: 100%;
  padding: 0 10px;
  position: relative;
  border-radius: ${({ theme: { shape: { borderRadius }}}) => `${borderRadius}px ${borderRadius}px 0 0`};
`;

export const Title = styled(Typography)`
  color: ${({ theme }) => theme.palette.primary.contrastText};
  line-height: 50px;
  height: 100%;
  min-width: 10px;
  min-height: 50px;
  margin: 0px;
`;

export const Icons = styled(Box)`
  position: absolute;
  display: flex;
  right: 15px;
  top: 0px;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const Content = styled(Box)<{ fullBorder?: boolean, invert?: boolean }>`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: ${({ theme, invert }) => invert ? theme.palette.primary.main : theme.palette.background.paper };
  border: ${({ fullBorder, theme }) => fullBorder ? `3px solid ${theme.palette.primary.main}` : 'none'};
  border-top: none;
  border-radius: 0 0 25px 25px;
`;

type CardProps = {
  width: string;
  size: 'xs' | 'md' | 'xl';
  margin: string;
}

// @mui/material/styles returns any so i use the emotion's styled function instead
const emotion = { styled: emotionStyled };
export const StyledCard = emotion.styled(Card)<CardProps>`
  width: ${({ width }) => width};
  max-width: ${({ size }) => ({ xs: '150px', md: '500px', xl: '1500px' }[size])};
  margin: ${({ margin }) => margin};
  padding: 0;
  overflow: visible;

  & .MuiCardContent-root {
    padding: 0;
  }

  & .MuiCardContent-root:last-child {
    padding: 0;
  }
`;