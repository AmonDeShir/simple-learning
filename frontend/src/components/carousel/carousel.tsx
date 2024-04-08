import ReactCarousel from 'react-material-ui-carousel';
import { PropsWithChildren } from "react";
import { Container } from "./carousel.styles";
import { NavigationButton } from './navigation-button';

type Props = PropsWithChildren<{
  height?: string;
  hideNavigation?: boolean;
  swipe?: boolean;
}>;


export const Carousel = ({ 
  children, 
  height,
  swipe 
}: Props) => (
  <Container height={height} {...{ "data-testid": 'carousel' }}>
    <ReactCarousel
      NavButton={NavigationButton(height)}
      animation='slide'
      indicators={false}
      swipe={swipe}
      autoPlay={false}
      height={height}
      sx={{ width: '100%' }}
    >
      {children}
    </ReactCarousel>
  </Container>
);