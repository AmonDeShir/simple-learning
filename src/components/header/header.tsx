import { useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AnimatedIcon } from '../animated-icon/animated-icon';
import { BackgroundBox } from '../styles/styles';
import { Bar, barHeight, Icons, IconsContainer, Title } from './header.styles';
import { enterFullscreenMode, exitFullscreenMode } from './header.animations';
import { UserMenu } from "../user-menu/user-menu";
import { useAppSelector } from "../../redux/store";

type Props = {
  title: string;
}

export const Header = ({ title }: Props) => {
  const [ fullscreen, setFullscreen ] = useState(false);
  const userName = useAppSelector(state => state.user.name);

  const matchesPC = useMediaQuery('(min-width:1024px)');
  const matchesTablet = useMediaQuery('(min-width:768px)');
  
  const barRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const height = matchesPC ? 350 : 200;
  const barBorderRadius = matchesTablet ? '0' : '25px 25px 0 0';

  useEffect(() => {
    const callback = () => {
      const isFullscreen = window.scrollY > height - barHeight;
 
      if (fullscreen !== isFullscreen) {
        setFullscreen(isFullscreen);
      }
    }

    window.addEventListener('scroll', callback);
    return () => window.removeEventListener('scroll', callback);
  }, [barBorderRadius, fullscreen, height]);

  useEffect(() => {
    const items = {
      bar: barRef.current, 
      icons: iconsRef.current, 
      userMenu: userMenuRef.current
    }

    if (fullscreen) {
      return enterFullscreenMode(items);
    }
    else {
      return exitFullscreenMode(items, barBorderRadius);
    }
  }, [fullscreen, barBorderRadius])

  const navigate = () => {
    window.history.back();
  }

  return (
    <BackgroundBox
      justifyContent="space-between"
      alignItems="center"
      height={height}
      width="100%"
    >
      <IconsContainer height={height}>
        <Icons ref={iconsRef} height={height}>
          { window.location.pathname !== '/' 
            ? <AnimatedIcon Icon={ArrowBackIcon} onClick={navigate} /> 
            : <div></div>
          }
          
          <UserMenu 
            item="" 
            user={userName} 
            ref={userMenuRef}
          />
          
        </Icons>
      </IconsContainer>

      <Bar ref={barRef} borderRadius={barBorderRadius}>
        <Title align="center" variant="h5">
          {title}
        </Title> 
      </Bar>
    </BackgroundBox>
  )
};