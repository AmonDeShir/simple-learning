import { animation } from '../../utils/animation/animation';

export const shakeAnimation = animation((tl, item) => {
  tl
    .to(item, { rotateZ: '30deg', duration: 0.3 })
    .to(item, { rotateZ: '-25deg', duration: 0.5 })
    .to(item, { rotateZ: '360deg', duration: 1.2 })
    .set(item, { rotateZ: '0deg' })
});

export const scaleAnimation = animation((tl, item) => {
  tl
    .to(item, { scale: 0.75, duration: 0.125 })
    .to(item, { scale: 1.25, duration: 0.25 })
    .to(item, { scale: 1, duration: 0.25 })
});

