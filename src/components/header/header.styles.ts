import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import backgroundImage from '../../assets/background.jpg';

export const barHeight = 50;

export const Header = styled(Box)`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
`;

type IconsProp = {
  height: number;
}

export const IconsContainer = styled(Box)<IconsProp>`
  height: ${({ height }) => height - barHeight}px;
`;

export const Icons = styled(Box)<IconsProp>`
  display: flex;
  padding: 0 10px;
  justify-content: space-between;
  align-items: center;
  z-index: 3;
  height: ${({ height }) => height - barHeight}px;
`;

type BarProps = {
  borderRadius: string
}

export const Bar = styled(Box)<BarProps>`
  width: 100%;
  height: ${barHeight}px;
  border-radius: ${({ borderRadius }) => borderRadius};
  background-color: ${({ theme }) => theme.palette.primary.main};
  box-shadow: 0px -3px 6px 2px rgba(0,0,0,0.25);
  z-index: 2;
`;

export const Title = styled(Typography)`
  height: 100%;
  color: ${({ theme }) => theme.palette.primary.contrastText};
  line-height: 50px;
`;