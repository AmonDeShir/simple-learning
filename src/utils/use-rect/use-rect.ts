import React, { useState } from 'react';

import { useResize } from '../use-resize/use-resize';

export function useRect(ref: React.RefObject<HTMLElement>) {
  const [rect, setRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useResize(() => {
    const updateRect = ref.current?.getBoundingClientRect();

    if (!updateRect) {
      return;
    }

    setRect({
      x: updateRect.x,
      y: updateRect.y,
      width: updateRect.width,
      height: updateRect.height,
      top: updateRect.top,
      right: updateRect.right,
      bottom: updateRect.bottom,
      left: updateRect.left,
    });
  }, true);

  return rect;
}
