import AudiotrackIcon from '@mui/icons-material/AudiotrackOutlined';
import { useEffect, useMemo, useState } from 'react';
import { AnimatedIcon } from '../animated-icon/animated-icon';

type Props = {
  src: string,
  color?: 'black' | 'white' | 'primary' | 'secondary',
  size?: number,
}

export const AudioIcon = ({
  src,
  color="black",
  size = 25,
}: Props) => {
  const audio = useMemo(() => new window.Audio(src), [src])
  const [ loaded, setLoaded ] = useState(false);

  useEffect(() => {
    const event = () => setLoaded(true);

    audio.addEventListener('loadeddata', event);
    return () => audio.removeEventListener('loadeddata', event);
  }, [audio])

  const handleClick = () => {
    if (loaded) {
      audio.play();
    }
  }

  useEffect(() => () => audio.pause(), [audio]);

  return (
    <AnimatedIcon
      color={color}
      size={size}  
      Icon={AudiotrackIcon} 
      onClick={handleClick}
    />
  );
}