import gsap from 'gsap';
import { Animation } from 'animated-router-react';

export const emptyAnimation:  Animation = {
  animation: () => {}, 
  time: 0
};

export const exitRight: Animation = {
  animation: (ref) => {
    gsap
      .timeline()
      .set(document.body, { overflow: 'hidden' })
      .fromTo(
        ref.current,
        { translateX: '0' },
        { translateX: '-100vw', duration: 0.5 },
      );
  },
  time: 0.5,
};

export const enterRight: Animation = {
  animation: (ref) => {
    gsap
      .timeline()
      .set(document.body, { overflow: 'hidden' })
      .fromTo(
        ref.current,
        { translateX: '100vw' },
        { translateX: '0', duration: 0.5 },
      );
  },
  time: 0.5,
};