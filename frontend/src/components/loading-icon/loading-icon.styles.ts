import { keyframes } from "@emotion/react";
import { styled } from "@mui/material";
import { getColor } from "../../utils/get-color/get-color";

const shakeAnimation = keyframes`
  0% { transform: rotate(0deg); }
  15% { transform: rotate(30deg); }
  40% { transform: rotate(-25deg); }
  100% { transform: rotate(360deg)}
`;

type SvgProps = {
  color: string;
  size: number;
}

export const StyledSvg = styled('svg')<SvgProps>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  color: ${({ color, theme }) => getColor(theme, color)};
  animation-name: ${shakeAnimation};
  animation-duration: 2s;
  animation-iteration-count: infinite;
`; 

export const StyledPath = styled('path')<{ color: string }>`
  fill: ${({ color, theme }) => getColor(theme, color)};
`;