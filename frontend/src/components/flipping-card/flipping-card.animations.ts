import { animation } from '../../utils/animation/animation';

export const flipAnimation = animation<boolean, HTMLElement | null>((tl, item, flip) => {
  tl
    .set(item, { rotationX: flip ? 180 : 0 })
    .to(item, { rotationX: flip ? 0 : 180, duration: 0.5 })
});
