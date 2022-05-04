import { PropsWithChildren, useState } from 'react';
import ReactMasonry from 'react-masonry-css';
import { useResize } from '../../utils/use-resize/use-resize';
import "./masonry.styles.css";

type Props = PropsWithChildren<{
  itemWidth?: number;
}>;

export const Masonry = ({ 
  itemWidth = 450,
  children
}: Props) => {
  const [breakpoints, setBreakpoints] = useState(1);

  useResize((width) => {
    setBreakpoints(Math.max(1, Math.floor(0.9 * width / itemWidth)))
    
    document
      .querySelectorAll<HTMLElement>('.Masonry__Column')
      .forEach(el => el.style.maxWidth = `${itemWidth}px`)
  }, true);

  return (
    <ReactMasonry
      breakpointCols={breakpoints}
      className="Masonry__Main"
      columnClassName="Masonry__Column"
    >
      {children}
    </ReactMasonry>
  )
}