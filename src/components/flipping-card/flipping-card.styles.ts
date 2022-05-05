import { styled } from "@mui/material";

export const FlippingContainer = styled('div')<{width: string}>`
  position: relative;
  transform-style: preserve-3d;
  perspective: 800px;
  height: 300px;
  width: ${({ width }) => width};

  & .MuiCardContent-root:last-child {
    padding: 0;
  }
`;

export const Side = styled('div')<{ side: 'front' | 'back' }>`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  backface-visibility: hidden;
  transform: ${ ({ side }) => side === 'front' ? `rotateY(0deg) scaleY(1)` : `rotateY(180deg) scaleY(-1) scaleX(-1)`};
`;

export const CardContainer = styled('div')`
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  backface-visibility: hidden;
`