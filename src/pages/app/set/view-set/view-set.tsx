import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../../../components/header/header';
import { AnimatedIcon } from '../../../../components/animated-icon/animated-icon';
import { WordCard } from '../../../../components/word-card/word-card';
import { ActionButtons, CenterPage, StyledTypography } from './view-set.styles';
import { Masonry } from '../../../../components/masonry/masonry';
import { useEffect, useState } from 'react';
import { fetchData } from '../../../../api/fetchData';
import { useAppDispatch } from '../../../../redux/store';
import { editSet } from '../../../../redux/slices/edit-set/edit-set';
import { SetData } from '../../../../redux/slices/edit-set/edit-set.type';
import { SquareButton } from '../../../../components/styles/styles';
import { useMediaQuery } from '@mui/material';
import { Loading, RegisterLoading } from '../../../../components/loading/loading';
import { handleLoadingErrors,  } from '../../../../utils/load-data/load-data';
import { loadAdvancedData } from '../../../../utils/load-data/load-advanced-data';

export type WordData = {
  id: string,
  word: string;
  meaning: string;
  audio: string;

  firstExample: {
    example: string;
    translation: string;
    audio: string;
  },

  secondExample: {
    example: string;
    translation: string;
    audio: string;
  }
}

export const ViewSet = () => {
  const { setId } = useParams();
  const [ set, setSet ] = useState<SetData>({ id: '', title: '', protected: false, words: [] });
  const [ loading, setLoading ] = useState<RegisterLoading>({ state: 'loading', message: '' });
  const matchesPC = useMediaQuery('(min-width:1024px)');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const abortController = new AbortController();
      
    fetchData(() => axios.get(`../api/v1/sets/${setId}`, { signal: abortController.signal }), navigate)
      .then((res) => loadAdvancedData(res, ({ words }: SetData) => words, (words, data) => ({ ...data, words }), setSet, setLoading))
      .catch(e => handleLoadingErrors(e, setLoading));

    return () => abortController.abort();
  }, [navigate, setId]);

  const editHandler = () => {
    dispatch(editSet(set.id));
    navigate(`/edit-set`);
  }

  return (
    <CenterPage>
      <Header title={set.title} />

      <ActionButtons {...{"data-testid": "action-buttons"}}>
        <Link to={`/game/flashcards/${set.id}`}>
          <SquareButton items={4} variant="contained">
            Flash<br/>cards
          </SquareButton>
        </Link>

        <Link to={`/game/writing/${set.id}`}>
          <SquareButton items={4} variant="contained">
            Writing
          </SquareButton>
        </Link>
        
        {matchesPC &&
          <StyledTypography align="center" variant="h6">
            Words in the set
          </StyledTypography>
        }

        <Link to={`/game/speller/${set.id}`}>
          <SquareButton items={4} variant="contained">
            Speller
          </SquareButton>
        </Link>
        
        <Link to={`/game/mix/${set.id}`}>
          <SquareButton items={4} variant="contained">
            Mix
          </SquareButton>
        </Link>
      </ActionButtons>

      {!matchesPC &&
        <StyledTypography align="center" variant="h6">
          Words in the set
        </StyledTypography>
      }
      
      <Loading timeout={10000} {...loading}>
        <Masonry itemWidth={500}>
          {
            set.words.map((word) => (
              <WordCard
                key={word.id}
                data={word}  
                icons={[
                  <AnimatedIcon 
                    Icon={EditIcon} key="0" 
                    size={25} 
                    onClick={editHandler} 
                  />,
                ]}
              />
            ))
          }
        </Masonry>
      </Loading>
    </CenterPage>
  );
};
