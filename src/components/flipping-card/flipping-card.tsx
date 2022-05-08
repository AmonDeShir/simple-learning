import { capitalize, Typography } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from "react";
import { GameItem } from "../../redux/slices/game/game.type";
import { AudioIcon } from '../audio-icon/audio-icon';
import { Card } from '../card/card';
import { CardContainer, FlippingContainer, Side } from "./flipping-card.styles";
import { flipAnimation } from './flipping-card.animations';

type Props = {
  data: GameItem;
  width?: string;
  icons?: JSX.Element[];
  muteOnMount?: boolean;
  onFlip?: (side: 'front' | 'back', data: GameItem) => void;
}

export const FlippingCard = ({ data, width="90vw", icons = [], onFlip, muteOnMount }: Props) => {
  const [isFlipped, setFlipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audio = useMemo(() => new Audio(data.audio), [data.audio]);

  const text = capitalize(data.invert ? data.translation : data.text);
  const translation = capitalize(data.invert ? data.text : data.translation);

  const audioIcon = (invert?: boolean, color?: "white" | "primary") => (
    invert && !!data.audio ? [<AudioIcon key="-1" color={color} src={data.audio} />] : []
  );

  const flip = () => {
    if (onFlip) {
      onFlip(isFlipped ? 'front' : 'back', data);
    }
    
    flipAnimation(containerRef.current, isFlipped, () => {
      setFlipped((isFlipped) => !isFlipped)

      if (!isFlipped) {
        audio.play();
      }
    });
  };

  useEffect(() => {
    const event = () => {
      if (!data.invert && !muteOnMount) {
        audio.play();
      }
    };

    audio.addEventListener('loadeddata', event);
    return () => audio.removeEventListener('loadeddata', event);
  }, [audio, data.invert, isFlipped, muteOnMount]);

  useEffect(() => () => { audio.pause() }, [audio]);

  return (
    <FlippingContainer ref={containerRef} width={width}>
      <Side side="front" {...{ "data-testid": 'card-front' }}>
        <Card 
          title=""
          width="100%" 
          size='md'
          onClick={flip} 
          fullBorder  
          icons={[...icons, ...audioIcon(!data.invert, 'white')]}
        >
          <CardContainer>
            <Typography align='center' variant='h5' >{text}</Typography>
          </CardContainer>
        </Card>
      </Side>

      <Side side="back" {...{ "data-testid": 'card-back' }}>
        <Card 
          title=""
          width="100%" 
          size='md' 
          onClick={flip} 
          invert
          icons={[...icons, ...audioIcon(data.invert, 'primary')]}
        >
          <CardContainer>
            <Typography color="white" align='center' variant='h5'>
            {translation}
            </Typography>
          </CardContainer>
        </Card>
      </Side>
    </FlippingContainer>
  );
}