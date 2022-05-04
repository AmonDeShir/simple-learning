
export function mockAudio() {
  let eventCallbacks = new Array<{cb: ()=>void, event: string}>();
  const play = jest.fn();
  const pause = jest.fn();
  const origin = window.Audio;
  
  (window.Audio as any) = (class {
    src = '';

    constructor(src:string) {
      this.src = src;
    }

    play = () => play(this.src);
    pause = pause;
    addEventListener = (event: any, cb: any) => eventCallbacks.push({ event, cb });
    removeEventListener = (event: any, cb: any) => eventCallbacks = eventCallbacks.filter((item) => item.event !== event || item.cb !== cb);
  });

  return {
    origin,
    play,
    pause,
    loaded: () => {
      eventCallbacks.filter((item) => item.event === 'loadeddata').forEach(({cb}) => cb());
    },

    mockClear: () => {
      play.mockClear();
      pause.mockClear();
      eventCallbacks = [];
    },

    mockRestore: () => {
      play.mockRestore();
      pause.mockRestore();
      eventCallbacks = [];
      (window.Audio as any) = origin;
    }
  }
}

export type MockAudio = ReturnType<typeof mockAudio>;