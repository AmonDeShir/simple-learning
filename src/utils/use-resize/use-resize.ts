import { useEffect } from 'react';

export function useResize(
  callback: (width: number, height: number) => void,
  callCallbackOnInit = false,
) {
  useEffect(() => {
    const resizeHandler = () => callback(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', resizeHandler);

    if (callCallbackOnInit) {
      resizeHandler();
    }

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
