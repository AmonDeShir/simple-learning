import gsap from "gsap";

export default class Timeline {
  public static to(ref: HTMLElement | HTMLElement[], style: any) {
    [ref].filter((ref) => ref !== null).flatMap((ref) => ref).map(this.handleCss(style));
    return Timeline;
  }

  public static set(ref: HTMLElement | HTMLElement[], style: any) {
    [ref].filter((ref) => ref !== null).flatMap((ref) => ref).map(this.handleCss(style));
    return Timeline;
  }

  public static call(callback: () => void) {
    callback();
    return Timeline;
  }

  public static kill() {}

  private static handleCss(style: any) {
    return function (ref: HTMLElement) {
      for (const key in style) {
        const value = style[key];
        switch (key) {
          case 'scale':
            ref.style.transform = `scale(${value})`;
            break;
          case 'rotationX':
            ref.style.transform = `rotateX(${value}deg)`;
            break;
          case 'duration':
            break;

          default:
            ref.style[key as any] = value;
            break;
        }
      }
    };
  }
}

export function mockTimeline() {
  const timeline = jest.fn(() => Timeline);
  const origin = gsap.timeline;

  gsap.timeline = timeline as any;

  return {
    origin,
    timeline,
    mockClear: () => {
      timeline.mockClear();
      timeline.mockImplementation(() => Timeline);
    },
    mockRestore: () => {
      timeline.mockRestore();
      gsap.timeline = origin;
    }
  };
}

export type MockTimeline = ReturnType<typeof mockTimeline>;