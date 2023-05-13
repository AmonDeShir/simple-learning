import { capitalize, Typography } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { GameItem } from "../../redux/slices/game/game.type";
import { AudioIcon } from '../audio-icon/audio-icon';
import { Card } from '../card/card';
import { CardContainer, FlippingContainer, Side, TextFieldContainer } from "./flipping-card.styles";
import { Button, StandardTextField } from '../styles/styles';
import { CompareTexts } from '../compare-texts/compare-texts';
import { flipAnimation } from './flipping-card.animations';
import { Language } from '../../redux/slices/edit-set/edit-set.type';
import { DiacriticButtons } from '../diacritic-buttons/diacritic-buttons';

type Props = {
  data: GameItem;
  languages: Language[]; 
  onAnswer: (value: number) => void;
}

export const FlippingInputCard = ({ data, languages, onAnswer }: Props) => {
  const [isFlipped, setFlipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const audio = useMemo(() => new Audio(data.audio), [data.audio]);

  const [ answerText, setAnswerText ] = useState('');
  const [ errorMode, setErrorMode ] = useState<boolean>();
  const firstAnswer = useRef<number>();

  const text = capitalize(data.invert ? data.translation : data.text);
  const translation = capitalize(data.invert ? data.text : data.translation);

  const audioIcon = (color?: "white" | "primary") => (
    data.audio ? [<AudioIcon key="0" color={color} src={data.audio} />] : []
  );

  const prepareText = (text: string) => text.trim().replace(/[.,"!?]|(\(.*\))/g, '').toLowerCase();

  const handleAnswer = () => {
    if (firstAnswer.current === undefined) {
      firstAnswer.current = calcPercentage(prepareText(answerText), prepareText(text));
      setErrorMode(firstAnswer.current !== 1);
    }

    if (errorMode === false || firstAnswer.current === 1) {
      onAnswer(firstAnswer.current);
    }
  }

  const calcPercentage = (textA: string, textB: string) => {
    let theSame = 0;

    for (let i = 0; i < Math.max(textA.length, textB.length); i++) {
      if (textA[i] === textB[i]) {
        theSame++;
      }
    }

    return theSame / Math.max(textA.length, textB.length);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswerText(event.target.value);

    if (errorMode) {
      const percentage = calcPercentage(prepareText(event.target.value), prepareText(text));
      setErrorMode(percentage !== 1);
    }
  }

  const flip = () => {
    if (isFlipped) {
      handleAnswer();
    }

    flipAnimation(containerRef.current, isFlipped, () => {
      setFlipped((isFlipped) => !isFlipped)

      if (!data.invert && (!isFlipped || data.mode !== 'writing')) {
        audio.play();
      }
    });
  };

  useEffect(() => {
    const event = () => {
      if (data.mode !== 'writing' && !data.invert) {
        audio.play();
      }
    };

    audio.addEventListener('loadeddata', event);
    return () => audio.removeEventListener('loadeddata', event);
  }, [audio, data.invert, data.mode]);

  const addLetter = (letter: string) => {
    setAnswerText((text) => text + letter);
    input.current!.focus();
  }

  return (
    <FlippingContainer ref={containerRef} width="90vw">
      <Side side="front" {...{ "data-testid": 'card-front' }}>
        <Card 
          title={translation}
          width="100%" 
          size='md' 
          fullBorder  
          icons={data.mode !== 'writing' ? audioIcon('white') : undefined}
        >
          <CardContainer>
            <TextFieldContainer>
              <DiacriticButtons
                languages={languages}
                onClick={addLetter}
              />
              <StandardTextField 
                variant='standard' 
                label="Answer"
                value={answerText}
                onChange={handleInputChange}
                error={errorMode}
                helperText={errorMode ? `Copy: ${text}` : ''}
                inputProps={{ "data-testid": "flipping-input-card-textbox" }}
                inputRef={input}
              />
            </TextFieldContainer>

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