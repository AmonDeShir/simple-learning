import { animation } from '../../utils/animation/animation';

type Items = { 
  left: HTMLDivElement | null, 
  right: HTMLDivElement | null,
  avatar: HTMLDivElement | null,
};

export const hideAnimation = animation<Items>((tl, { left, right, avatar }) => {
  tl
    .to(left, { scaleX: 0, translateX: 100, duration: 0.25 })
    .to(right, { "--borderRadius": '25px', duration: 0.125 })
    .to(avatar, { scale: 0.8, duration: 0.25 })
    .to(right, { scale: 0, duration: 0.25 }, "<")
    .to(avatar, { scale: 1, duration: 0.25 })
});

export const showAnimation = animation<Items>((tl, { left, right, avatar }) => {
  tl
    .to(avatar, { scale: 0.8, duration: 0.25 })
    .to(avatar, { scale: 1, duration: 0.25 })
    .to(right, { scale: 1, duration: 0.25 }, "<")
    .to(right, { "--borderRadius": '0px', duration: 0.125 })

    .set(left, { translateX: 100, scaleY: 1 })
    .to(left, { scaleX: 1, translateX: 0, duration: 0.25 })
});

