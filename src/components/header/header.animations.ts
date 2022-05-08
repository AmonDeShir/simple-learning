import { animation } from '../../utils/animation/animation';

type Items = { bar: HTMLElement | null, icons: HTMLElement | null, userMenu: HTMLElement | null };

export const enterFullscreenMode = animation<Items>((tl, { bar, icons, userMenu }) => {
  tl
    .set(bar, { position: 'fixed', top: '0px' })
    .to(bar, { borderRadius: '0px', duration: 0.25 })
    .set(userMenu, { display: 'none' }, '<')
    .set(icons, {
      position: 'fixed',
      top: '0px',
      height: '50px',
      width: 'calc(100% - 20px)',
      alpha: 0,
    },  `<`)
    .to(icons, { alpha: 1, duration: 0.75 }, `<`)
})

export const exitFullscreenMode = animation<string, Items>((tl, { bar, icons, userMenu }, borderRadius) => {
  tl
    .set(bar, { position: 'static', top: 'none' })
    .to(bar, { borderRadius: borderRadius, duration: 0.25 })
    .set(userMenu, { display: 'block' }, '<')
    .set(icons, {
      position: 'static',
      top: 'none',
      height: '100%',
      width: 'none',
      alpha: 0,
    }, `<`)
    .to(icons, { alpha: 1, duration: 0.75 }, `<`)
});