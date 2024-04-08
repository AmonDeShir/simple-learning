import { css } from '@emotion/react';
import { Box, styled, Typography } from "@mui/material";

export const Container = styled(Box)<{ textposition: 'left' | 'right' | 'up' | 'down' | 'center' | 'center-after' }>`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;

  ${({ textposition }) => {
    let direction = 'row-reverse';
    let height = '40px';

    if (textposition === 'right') {
      direction = 'row';
    }

    if (textposition === 'up') {
      direction = 'column-reverse';
      height = '80px';
    }

    if (textposition === 'down') {
      direction = 'column';
      height = '80px';
    }

    return css`
      flex-direction: ${direction};
      height: ${height};
    `;
  }}
`;

export const StyledProgress = styled('div')<{ progress: number }>`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 40px; 
  padding: 0 7.5px;
  box-sizing: border-box;

  border-radius: 10px;
  border-width: 3px;
  background-color: ${({ theme }) => theme.palette.primary.dark};

  &::before {
    content: ' ';
    position: absolute;
    left: 0;
    top: 0;
    width: ${({ progress }) => progress}%;
    height: 100%;
    transition: width 0.5s ease;
    background-color: ${({ theme }) => theme.palette.primary.main};
    box-sizing: border-box;
  }

  &::after {
    content: ' ';
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: none;
    border-style: solid;
    border: 3px solid ${({ theme }) => theme.palette.primary.main};
    border-radius: 10px;
    box-shadow: inset 0px 0px 3.45px 0px rgba(0,0,0,0.25);
    box-sizing: border-box;
  }
`;


export const Text = styled(Typography)<{textposition: 'left' | 'right' | 'up' | 'down' | 'center' | 'center-after'}>`
  z-index: 1;
  padding: 0.4em;
  text-align: center;
  color: white;

  position: ${({ textposition }) =>
    textposition.split('-')[0] === 'center' ? 'absolute' : 'relative'};
`;

