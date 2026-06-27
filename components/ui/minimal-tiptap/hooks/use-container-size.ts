import type { RefObject } from 'react';
import { useCallback, useEffect, useState } from 'react';

const DEFAULT_RECT: DOMRect = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  toJSON: () => '{}'
};

export function useContainerSize(ref: RefObject<HTMLElement | null>): DOMRect {
  const [size, setSize] = useState<DOMRect>(DEFAULT_RECT);

  const handleResize = useCallback(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const newRect = element.getBoundingClientRect();

    setSize((prevRect) => {
      if (
        Math.round(prevRect.width) === Math.round(newRect.width) &&
        Math.round(prevRect.height) === Math.round(newRect.height)
      ) {
        return prevRect;
      }

      return newRect;
    });
  }, [ref]);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);

    resizeObserver.observe(element);

    window.addEventListener('click', handleResize);
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('click', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, [ref, handleResize]);

  return size;
}
