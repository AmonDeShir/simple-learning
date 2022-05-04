import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ButtonContainer } from './carousel.styles';

type Props = {
  onClick: Function;
  className: string;
  style: React.CSSProperties;
  next: boolean;
  prev: boolean;
}

export const NavigationButton = (height = "100%") => ({
  onClick,
  next,
  prev
}: Props) => (
  <ButtonContainer height={height} onClick={onClick as any}>
    { next && <ArrowForwardIosIcon />}
    { prev && <ArrowBackIosNewIcon />}
  </ButtonContainer>
)