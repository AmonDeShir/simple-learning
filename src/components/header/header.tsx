import { useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AnimatedIcon } from '../animated-icon/animated-icon';
import { BackgroundBox } from '../styles/styles';
import { Bar, barHeight, Icons, IconsContainer, Title } from './header.styles';
import { enterFullscreenMode, exitFullscreenMode } from './header.animations';
import { UserMenu } from "../user-menu/user-menu";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchData } from "../../api/fetchData";
import axios from "axios";
import { setUserData } from "../../redux/slices/users/user";

type Props = {
  title: string;
}

export const Header = ({ title }: Props) => {
  const [ fullscreen, setFullscreen ] = useState(false);
  const { name, sync } = useAppSelector(state => state.user);

  const matchesPC = useMediaQuery('(min-width:1024px)');
  const matchesTablet = useMediaQuery('(min-width:768px)');
  
  const barRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const abortController = useRef(new AbortController());

  const height = matchesPC ? 350 : 200;
  const barBorderRadius = matchesTablet ? '0' : '25px 25px 0 0';

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    if (!name) {
      axios.post('/api/v1/auth/refresh', {}, { signal: abortController.current.signal })
        .then(res => res.data.data)
        .then(data => dispatch(setUserData({...data })))
        .catch(() => navigate('/auth'));
    }
  }, [dispatch, name, navigate]);

  const openPreviousPage = () => {
    window.history.back();
  }

  const handleUserMenuClick = async () => {
    if (sync) {
      fetchData(() => axios.post('/api/v1/auth/log-out', {}, { signal: abortController.current.signal }), navigate);
      navigate('/auth');
    }
    else {
      navigate('/auth/register');
    }
  };

  useEffect(() => () => abortController.current.abort(), []);

  return (
    <BackgroundBox
      justifyContent="space-between"
      alignItems="center"
      height={height}
      width="100%"
    >
      <IconsContainer height={height}>
        <Icons ref={iconsRef} height={height}>
          { location.pathname !== '/' 
            ? <AnimatedIcon Icon={ArrowBackIcon} onClick={openPreviousPage} /> 
            : <div {...{ "data-testid": 'header--spacer' }}></div>
          }
          
          <UserMenu 
            ref={userMenuRef}
            user={name}
            item={ sync ? 'Log out' : 'Register' }
            onItemClick={handleUserMenuClick}
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