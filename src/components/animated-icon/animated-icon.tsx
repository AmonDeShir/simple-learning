import { SvgIconProps, SvgIcon } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { scaleAnimation, shakeAnimation } from './animated-icon.animations';

type Props = { 
  Icon: typeof SvgIcon,
  size?: number,
  color?: string,
} & Omit<SvgIconProps, "color">;

/**
 * ref property will be overwritten
 * @returns 
 */
export const AnimatedIcon = ({ Icon, color="white", size=40, ...props }: Props) => {
  const [ isClickAnimationPlaying, setIsClickAnimationPlaying ] = useState(false);
  const [ isHoverAnimationPlaying, setIsHoverAnimationPlaying ] = useState(false);

  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isHoverAnimationPlaying) {
      return;
    }

    return shakeAnimation(ref.current, () => setIsHoverAnimationPlaying(false));
  }, [isHoverAnimationPlaying]);

  useEffect(() => {
    if (!isClickAnimationPlaying) {
      return;
    }

    return scaleAnimation(ref.current, () => setIsClickAnimationPlaying(false));
  }, [isClickAnimationPlaying]);
  
  const handleMouseEnter = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setIsHoverAnimationPlaying(true)

    if (props.onMouseEnter) {
      props.onMouseEnter(event)
    }
  }

  const handleClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setIsClickAnimationPlaying(true)
    event.stopPropagation();

    if (props.onClick) {
      props.onClick(event)
    }
  }

  return (
    <Icon
      sx={{ fontSize: size, color: (theme) => theme.palette[color as 'primary']?.main ?? color }}
      {...props }
      {...{ ref: ref } as any}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    />
  )
}
