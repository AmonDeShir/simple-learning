import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { useResize } from './use-resize';

describe(`useResize`, () => {
  it(`should call the callback function if the window was resized`, () => {
    const callback = jest.fn();
    renderHook(() => useResize(callback));

    act(() => {
      global.innerWidth = 500;
      global.innerHeight = 500;
      global.dispatchEvent(new Event('resize'));
    });

    expect(callback).toBeCalledWith(500, 500);
  });

  it(`should call the callback function on init if the callCallbackOnInit parameter is set to true`, () => {
    const callback = jest.fn();
    renderHook(() => useResize(callback, true));

    expect(callback).toBeCalled();
  });
});
