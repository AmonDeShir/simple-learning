import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Container = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

type StyledSvgProps = {
  height: number;
  side?: 'left' | 'right';
}

const IconHeightToWidth = 0.29;

export const StyledSvg = styled('svg')<StyledSvgProps>`
  height: ${({ height }) => height}px;
  width: ${({ height }) => height * IconHeightToWidth}px;
  padding: 0 5px;
  box-sizing: content-box;
  ${({ side = 'left' }) => side === 'right' && `transform: rotate(180deg);`}
`;

export const Text = styled(Box)`
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.43;
  letter-spacing: 0.01071em;
  padding: 0;
  margin: 0;
  text-align: center;
`;