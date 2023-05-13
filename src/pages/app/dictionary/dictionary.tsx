import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import axios from 'axios';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Header } from '../../../components/header/header';
import { AnimatedIcon } from '../../../components/animated-icon/animated-icon';
import { WordCard } from '../../../components/word-card/word-card';
import { CenterPage, StyledTypography } from './dictionary.styles';
import { Masonry } from '../../../components/masonry/masonry';
import { SearchFrom } from '../../../components/search-from/search-form';
import { useEffect, useRef, useState } from 'react';
import { fetchData } from '../../../api/fetchData';
import { Loading, RegisterLoading } from '../../../components/loading/loading';
import { handleLoadingErrors, loadData } from '../../../utils/load-data/load-data';
import { Language } from '../../../redux/slices/edit-set/edit-set.type';
import { LanguageOption } from '../../../components/search-menu/serach-menu';
import { AdditionalTranslationInformationIcon } from '../../../components/additional-translation-information/additional-translation-information';

export type WordData = {
  word: string;
  meaning: string;
  audio: string;
  language: Language,
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

export type WordDataTranslate = WordData & {
  info?: {
    addition: string,
    partOfSpeech: string,
    lang: {
      en: string, 
      ru: string, 
      be: string, 
      uk: string, 
      pl: string, 
      cs: string, 
      sk: string, 
      bg: string, 
      mk: string, 
      sr: string, 
      hr: string, 
      sl: string,
    }
  }
}

export const Dictionary = () => {
  const params = useParams();
  const [query] = useSearchParams();
  const abortController = useRef(new AbortController());
  const [ search, setSearch ] = useState(params.word);
  const [from, setFrom] = useState(query.get('from') ?? undefined);
  const [to, setTo] = useState(query.get('to') ?? undefined);
  const [ translation, setTranslation ] = useState<WordDataTranslate[]>([]);
  const [ words, setWords ] = useState<WordDataSets[]>([]);

  const [ loadingTranslation, setLoadingTranslation ] = useState<RegisterLoading>({ state: 'loading', message: '' });
  const [ loadingSet, setLoadingSet ] = useState<RegisterLoading>({ state: 'loading', message: '' });

  const navigate = useNavigate();

  const createQuery = () => {
    let query = '';

    if (from || to) {
      query = `?${from ? 'from=' + from : ''}`;

      if (query.length > 1 && to) {
        query += '&'
      }

      query += to ? 'to=' + to : '';
    };
    
    return query;
  }

  useEffect(() => {    
    setLoadingTranslation({ state: 'loading', message: '' });
    setLoadingSet({ state: 'loading', message: '' });

    fetchData(() => axios.get(`../api/v1/words/search/${search}`, { signal: abortController.current.signal }), navigate)
      .then((res) => loadData(res, setWords, setLoadingSet))
      .catch((e) => handleLoadingErrors(e, setLoadingSet));

    fetchData(() => axios.get(`../api/v1/dictionary/search/${search}${createQuery()}`, { signal: abortController.current.signal }), navigate)
      .then((res) => loadData(res, setTranslation, setLoadingTranslation))
      .catch((e) => handleLoadingErrors(e, setLoadingTranslation));

  }, [navigate, search, from, to]);

  
  const saveWord = async (word: WordData) => {
    setLoadingSet({ state: 'loading', message: '' });

    await fetchData(() => axios.post(`../api/v1/user/save-word`, { word }, { signal: abortController.current.signal }), navigate);
    await fetchData(() => axios.get(`../api/v1/words/search/${search}${createQuery()}`, { signal: abortController.current.signal }), navigate)
      .then((res) => loadData(res, setWords, setLoadingSet))
      .catch((e) => handleLoadingErrors(e, setLoadingSet));
  };

  useEffect(() => () => abortController.current.abort(), [])

  const handleSearchSubmit = (value: string, from?: LanguageOption, to?: LanguageOption) => {
    setSearch(value);
    setFrom(from);
    setTo(to);
  }

  return (
    <CenterPage>
      <Header title="Dictionary" />
      <SearchFrom
        defaultValue={search}
        title="Search word in database and diki"
        label="Search word"
        onSubmit={handleSearchSubmit}
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
      
      <Loading timeout={10000} {...loadingTranslation}>
        <Masonry itemWidth={500}>
          {
            translation.map((word, index) => (
              <WordCard
                key={`${word.word}-${word.meaning}-${index}`}
                icons={[                  
                  ...(word.info ? [<AdditionalTranslationInformationIcon key="1" info={word.info} /> ] : []),
                  <AnimatedIcon onClick={() => saveWord(word)} key="0" Icon={AddRoundedIcon} size={35} />
                ]}
                data={word}   
              />
            ))
          }
        </Masonry>
      </Loading>
    </CenterPage>
  );
};
