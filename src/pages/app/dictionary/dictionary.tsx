import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../../components/header/header';
import { AnimatedIcon } from '../../../components/animated-icon/animated-icon';
import { WordCard } from '../../../components/word-card/word-card';
import { CenterPage, StyledTypography } from './dictionary.styles';
import { Masonry } from '../../../components/masonry/masonry';
import { SearchFrom } from '../../../components/search-from/search-form';
import { useEffect, useState } from 'react';
import { fetchData } from '../../../api/fetchData';
import { Loading, RegisterLoading } from '../../../components/loading/loading';
import { handleLoadingErrors, loadData } from '../../../utils/load-data/load-data';
import { useAppDispatch } from '../../../redux/store';

export type WordData = {
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

export type WordDataSets = WordData & {
  id: string,
  usedIn: {
    id: string,
    title: string,
  }[]
}

export const Dictionary = () => {
  const params = useParams();
  const [ search, setSearch ] = useState(params.word);
  const [ diki, setDiki ] = useState<WordData[]>([]);
  const [ words, setWords ] = useState<WordDataSets[]>([]);

  const [ loadingDiki, setLoadingDiki ] = useState<RegisterLoading>({ state: 'loading', message: '' });
  const [ loadingSet, setLoadingSet ] = useState<RegisterLoading>({ state: 'loading', message: '' });


  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const abortController = new AbortController();
    
    setLoadingDiki({ state: 'loading', message: '' });
    setLoadingSet({ state: 'loading', message: '' });

    fetchData(() => axios.get(`../api/v1/words/search/${search}`, { signal: abortController.signal }), dispatch)
      .then((res) => loadData(res, setWords, setLoadingSet))
      .catch((e) => handleLoadingErrors(e, setLoadingSet));

    fetchData(() => axios.get(`../api/v1/diki/search/${search}`, { signal: abortController.signal }), dispatch)
      .then((res) => loadData(res, setDiki, setLoadingDiki))
      .catch((e) => handleLoadingErrors(e, setLoadingDiki));

      return () => abortController.abort();
  }, [dispatch, search]);

  return (
    <CenterPage>
      <Header title="Dictionary" />
      <SearchFrom
        defaultValue={search}
        title="Search word in database and diki"
        label="Search word"
        onSubmit={setSearch}
      />

      <StyledTypography align="center" variant="h6">
        Results from dictionary
      </StyledTypography>
      
      <Loading timeout={10000} {...loadingSet}>
        <Masonry itemWidth={500}>
          {
            words.map((word) => (
              <WordCard
                key={word.id}
                data={word}  
                icons={[
                  <AnimatedIcon 
                    key="0" 
                    Icon={FileOpenOutlinedIcon} 
                    onClick={() => navigate(`/set/${word.usedIn[0].id}`)} 
                    size={25}
                  />
                ]}
              />
            ))
          }
        </Masonry>
      </Loading>

      <StyledTypography align="center" variant="h6">
        Results from an online dictionary
      </StyledTypography>
      
      <Loading timeout={10000} {...loadingDiki}>
        <Masonry itemWidth={500}>
          {
            diki.map((word, index) => (
              <WordCard
                key={`${word.word}-${word.meaning}-${index}`}
                icons={[<AnimatedIcon key="0" Icon={AddRoundedIcon} size={35} />]}
                data={word}   
              />
            ))
          }
        </Masonry>
      </Loading>
    </CenterPage>
  );
};
