import { capitalize, Typography } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { GameItem } from "../../redux/slices/game/game.type";
import { AudioIcon } from '../audio-icon/audio-icon';
import { Card } from '../card/card';
import { CardContainer, FlippingContainer, Side } from "./flipping-card.styles";
import { Button, StandardTextField } from '../styles/styles';
import { CompareTexts } from '../compare-texts/compare-texts';
import { flipAnimation } from './flipping-card.animations';

type Props = {
  data?: GameItem;
  onAnswer: (value: boolean) => void;
}

export const FlippingInputCard = ({ data, onAnswer }: Props) => {
  const [isFlipped, setFlipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audio = useMemo(() => new Audio(data?.audio), [data?.audio]);

  const [ answerText, setAnswerText ] = useState('');
  const [ errorMode, setErrorMode ] = useState<boolean>();
  const firstAnswer = useRef<boolean>();

  const text = capitalize(data?.invert ? data?.translation : data?.text ?? '');
  const translation = capitalize(data?.invert ? data?.text : data?.translation ?? '');

  const audioIcon = (color?: "white" | "primary") => (
    data?.audio ? [<AudioIcon key="0" color={color} src={data.audio} />] : []
  );

  const prepareText = (text: string) => text.trim().replace(/[.,"!?]|(\(.*\))/g, '').toLowerCase();

  const handleAnswer = () => {

    if (firstAnswer.current === undefined) {
      firstAnswer.current = prepareText(answerText) === prepareText(text);
      setErrorMode(!firstAnswer.current);
    }

    if (errorMode === false || firstAnswer.current) {
      onAnswer(firstAnswer.current);
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswerText(event.target.value);

    if (errorMode) {
      setErrorMode(prepareText(event.target.value) !== prepareText(text));
    }
  }

  const flip = () => {
    if (isFlipped) {
      handleAnswer();
    }

    flipAnimation(containerRef.current, isFlipped, () => {
      setFlipped((isFlipped) => !isFlipped)

      if (!data?.invert && (!isFlipped || data?.mode !== 'writing')) {
        audio.play();
      }
    });
  };

  useEffect(() => {
    const event = () => {
      if (data?.mode !== 'writing' && !data?.invert) {
        audio.play();
      }
    };

    audio.addEventListener('loadeddata', event);
    return () => audio.removeEventListener('loadeddata', event);
  }, [audio, data?.invert, data?.mode]);

  return (
    <FlippingContainer ref={containerRef} width="90vw">
      <Side side="front" {...{ "data-testid": 'card-front' }}>
        <Card 
          title={translation}
          width="100%" 
          size='md' 
          fullBorder  
          icons={data?.mode !== 'writing' ? audioIcon('white') : undefined}
        >
          <CardContainer>
            <StandardTextField 
              variant='standard' 
              label="Answer"
              value={answerText}
              onChange={handleInputChange}
              error={errorMode}
              helperText={errorMode ? `Copy: ${text}` : ''}
              inputProps={{ "data-testid": "flipping-input-card-textbox" }}
            />

            <Button variant='contained' onClick={flip}>Answer</Button>
          </CardContainer>
        </Card>
      </Side>

      <Side side="back" {...{ "data-testid": 'card-back' }}>
        <Card 
          title={translation}
          width="100%" 
          size='md' 
          onClick={flip} 
          invert
          icons={audioIcon('primary')}
        >
          <CardContainer>
            <Typography color="white" align='center' variant='h5'>
              <CompareTexts
                text={prepareText(answerText)}
                goal={prepareText(text)}
              />
            </Typography>
          </CardContainer>
        </Card>
      </Side>
    </FlippingContainer>
  );
}