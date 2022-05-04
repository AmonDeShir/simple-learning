import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { RefObject } from 'react';

import { useRect } from './use-rect';

describe(`useRect`, () => {
  it(`should call the getBoundingClientRect function if the window was resized`, () => {
    const mockRef = { current: { getBoundingClientRect: jest.fn() } };

    renderHook(() => useRect((mockRef as unknown) as RefObject<HTMLElement>));
    act(() => {
      global.dispatchEvent(new Event('resize'));
    });

    expect(mockRef.current.getBoundingClientRect).toBeCalledTimes(2);
  });

  it(`should return zeros if the reference parameter is null`, () => {
    const mockRef = { current: null };
    const { result } = renderHook(() =>
      useRect((mockRef as unknown) as RefObject<HTMLElement>),
    );

    act(() => {
      global.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toEqual({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });
  });
});
