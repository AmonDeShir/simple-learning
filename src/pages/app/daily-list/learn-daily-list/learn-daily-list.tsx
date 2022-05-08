import { Box, Grow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlippingCard } from "../../../../components/flipping-card/flipping-card";
import { FlippingInputCard } from "../../../../components/flipping-card/flipping-input-card";
import { Header } from "../../../../components/header/header";
import { LearnStatisticsCard } from "../../../../components/learn-statistics-card/learn-statistics-card";
import { Loading } from "../../../../components/loading/loading";
import { Progress } from "../../../../components/progress/progress";
import { SlideUpdate } from "../../../../components/slide-update/slide-update";
import { SquareButton } from "../../../../components/styles/styles";
import { GameItem } from "../../../../redux/slices/game/game.type";
import { answer, loadData, saveProgress } from "../../../../redux/slices/learn/learn";
import { useAppDispatch, useAppSelector } from "../../../../redux/store";
import { superMemo } from "../../../../super-memo/super-memo";
import { CenterPage } from "../show-daily-list/show-daily-list.styles";
import { ButtonContainer, CardContainer, ProgressContainer } from "./learn-daily-list.styles";

export const LearnDailyList = () => {
  const { statistics, item, items, done, learning, remaining, progress } = useAppSelector((state) => state.learn);
  const [ showButtons, setShowButtons ] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadData());
  }, [dispatch]);

  const handleAnswer = async (percentage: number) => {
    setShowButtons(false);

    setTimeout(() => {
      dispatch(answer(percentage));
    }, 250)
  }

  const inputData = items.find(({ id }) => id === item);

  const handleFlip = (side: 'front' | 'back', item: GameItem) => {

    if (item.mode !== 'information') {
      setShowButtons(side === 'back');
      return;
    }
    
    if (side === 'front') {
      handleAnswer(1);
    }
  }

  const calcNextRepetition = (answer: 0 | 1 | 2 | 3) => {
    if (!inputData) {
      return '';
    }

    const interval = superMemo(inputData.progress, answer).interval;
    
    if (interval <= 1) {
      return `1 minute`;
    }
    
    if (interval < 60) {
      return pluralize(Math.floor(interval), `minute`);
    }

    if (interval < 1440) {
      return pluralize(Math.floor(interval / 60), `hour`);
    }

    return pluralize(Math.floor(interval / 1440), `day`);
  }

  const pluralize = (number: number, word: string) => {
    const plural = number === 1 ? '' : 's';

    return `${number} ${word}${plural}`;
  }

  useEffect(() => {
    if (progress.mode === 'done') {
      dispatch(saveProgress());
    }
  });

  return (
    <CenterPage>
      <Header title="Learn daily list" />
      <ProgressContainer>
        <Progress value={done.length} max={items.length} format="fraction" text="Done" />
        <Progress value={learning.length} max={items.length} format="fraction" text="Learning" reverse />
        <Progress value={remaining.length} max={items.length} format="fraction" text="Remaining" />
      </ProgressContainer>

      <Loading timeout={10000} {...progress}>
        <>
          <CardContainer>
            { inputData && (
              <SlideUpdate id={progress.mode === 'done' ? 'done' : inputData.inGameId}>
                {progress.mode === 'saving' 
                  ? (
                    <LearnStatisticsCard
                      onClick={() => navigate(`/`)}
                      items={items}
                      answers={Object.keys(statistics).map(key => ({ 
                        item: key, 
                        values: statistics[key].answers, 
                        nextRepetition: statistics[key].nextRepetition 
                      }))}
                    />
                  )
                  : (
                    (inputData.mode === 'writing')
                    ? <FlippingInputCard data={inputData} onAnswer={handleAnswer} />
                    : <FlippingCard data={inputData} onFlip={handleFlip} />
                  )
                }
              </SlideUpdate>
            )}
          </CardContainer>
          
          <ButtonContainer>
            <Grow in={showButtons} timeout={250}>
              <Box>
                <SquareButton variant="contained" items={2} onClick={() => handleAnswer(0)}>Again</SquareButton>
                <Typography align="center">{calcNextRepetition(0)}</Typography>
              </Box>
            </Grow>
    
            <Grow in={showButtons} timeout={250}>
              <Box>
                <SquareButton variant="contained" items={2} onClick={() => handleAnswer(0.4)}>Good</SquareButton>
                <Typography align="center">{calcNextRepetition(1)}</Typography>
              </Box>
            </Grow>
    
            <Grow in={showButtons} timeout={250}>
              <Box>
                <SquareButton variant="contained" items={2} onClick={() => handleAnswer(0.8)}>Easy</SquareButton>
                <Typography align="center">{calcNextRepetition(2)}</Typography>
              </Box>
            </Grow>

            <Grow in={showButtons} timeout={250}>
              <Box>
                <SquareButton variant="contained" items={2} onClick={() => handleAnswer(1)}>Very Easy</SquareButton>
                <Typography align="center">{calcNextRepetition(3)}</Typography>
              </Box>
            </Grow>
          </ButtonContainer>
        </>
      </Loading>
    </CenterPage>
  );
};