import { capitalize, Grow } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FlippingCard } from "../../../components/flipping-card/flipping-card";
import { SlideUpdate } from "../../../components/slide-update/slide-update";
import { Header } from "../../../components/header/header";
import { Progress } from "../../../components/progress/progress";
import { SquareButton } from "../../../components/styles/styles";
import { answer, loadSet } from "../../../redux/slices/game/game";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { ButtonContainer, CardContainer, CenterPage, ProgressContainer } from "./game.styles";
import { FlippingInputCard } from "../../../components/flipping-card/flipping-input-card";
import { TextGameItemMode } from "../../../redux/slices/game/game.type";
import { GameStatisticsCard } from "../../../components/game-statistics-card/game-statistics-card";
import { Loading, RegisterLoading } from "../../../components/loading/loading";

export const Game = () => {
  const params = useParams();
  const { setId, mode, statistics, item, items, languages, correct, incorrect, remaining, progress } = useAppSelector((state) => state.game);
  const [ showButtons, setShowButtons ] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadSet({ id: params.setId, mode: params.mode }));
  }, [dispatch, params.mode, params.setId]);

  const handleAnswer = async (value: number) => {
    setShowButtons(false);

    setTimeout(() => {
      dispatch(answer(value === 1));
    }, 250)
  }

  const inputData = items.find(({ id }) => id === item);
  const [ loading, setLoading ] = useState<RegisterLoading>({ state: 'loading', message: '' });

  useEffect(() => {
    const loadingStates = {'idle': 1, 'loading-pending': 1};
    const successStates = {'done': 1, 'loading-success': 1};

    if (progress in loadingStates) {
      setLoading({ state: 'loading', message: '' });
    }
    else if (progress in successStates) {
      if (items.length === 0) {
        setLoading({ state: 'empty', message: 'Before you start playing, please add some words to the set.' });
      }
      else {
        setLoading({ state: 'success', message: '' });
      }
    }
    else {
      setLoading({ state: 'error', message: 'There was an error. Please try again' });
    }
  }, [items.length, progress]);

  return (
    <CenterPage>
      <Header title={capitalize(mode)} />
      <ProgressContainer>
        <Progress value={correct.length} max={items.length} format="fraction" text="Correct" />
        <Progress value={incorrect.length} max={items.length} format="fraction" text="Incorrect" reverse />
        <Progress value={remaining.length} max={items.length} format="fraction" text="Remaining" />
      </ProgressContainer>

      <Loading timeout={10000} {...loading}>
        <>
          <CardContainer>
            { inputData && (
              <SlideUpdate id={progress === 'done' ? 'done' : inputData.inGameId}>
                {progress === 'done' 
                  ? (
                    <GameStatisticsCard
                      onClick={() => navigate(`/set/${setId}`)}
                      all={items.length}
                      corrects={statistics.correct.map((item) => ({ id: item.id, title: item.text, value: item.translation }))}
                      wrongs={statistics.incorrect.map((item) => ({ id: item.id, title: item.text, value: item.translation }))}
                    />
                  )
                  : (
                    (inputData.mode in TextGameItemMode)
                    ? <FlippingInputCard languages={languages} data={inputData} onAnswer={handleAnswer} />
                    : <FlippingCard data={inputData} onFlip={(side) => setShowButtons(side === 'back')} />
                  )
                }
              </SlideUpdate>
            )}
          </CardContainer>

          <ButtonContainer>
            <Grow in={showButtons} timeout={250}>
              <SquareButton variant="contained" items={2} onClick={() => handleAnswer(1)}>Good</SquareButton>
            </Grow>

            <Grow in={showButtons} timeout={250}>
              <SquareButton variant="contained" items={2} onClick={() => handleAnswer(0)}>Again</SquareButton>
            </Grow>
          </ButtonContainer>
        </>
      </Loading>
    </CenterPage>
  );
}