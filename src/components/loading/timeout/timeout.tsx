import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';

type Props = {
  time: number,
}

export const Timeout = ({ time }: Props) => {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDisplay(true), time);
    return () => clearTimeout(timeout);
  }, [time]);

  return !display ? (
    <></>
  ) : (
    <Typography color="#727272" align='center' variant='body1'>
      Loading takes more time than usual, please check your internet connection
    </Typography>
  );
};

