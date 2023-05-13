import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../../../api/fetchData";
import { Loading, RegisterLoading } from "../../../../components/loading/loading";
import { Masonry } from "../../../../components/masonry/masonry";
import { SearchFrom } from "../../../../components/search-from/search-form"
import { UsedInInfoIcon } from "../../../../components/used-in-info-icon/used-in-info-icon";
import { WordCard } from "../../../../components/word-card/word-card";
import { WordDataConstructor } from "../../../../redux/slices/edit-set/edit-set.type";
import { useAppSelector } from "../../../../redux/store";
import { handleLoadingErrors, loadData } from "../../../../utils/load-data/load-data";
import { WordData, WordDataSets } from "../../dictionary/dictionary";
import { StyledTypography } from "../edit-set/edit-set.styles"
import { Container } from "./new-word.styles";

type Props = {
  word: string;
  onSelect: (data: WordDataConstructor) => void;
}

export const SelectDefinition = ({ word, onSelect }: Props) => {
  const setId = useAppSelector(({ editSet }) => editSet.id);
  const [ diki, setDiki ] = useState<WordData[]>([]);
  const [ words, setWords ] = useState<WordDataSets[]>([]);
  const [ search, setSearch ] = useState(word);
  
  const [ loadingDiki, setLoadingDiki ] = useState<RegisterLoading>({ state: 'loading', message: '' });
  const [ loadingSet, setLoadingSet ] = useState<RegisterLoading>({ state: 'loading', message: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    const notFromTheSameSet = (word: WordDataSets) => word.usedIn.every(({ id }) => id !== setId);

    setLoadingDiki({ state: 'loading', message: '' });
    setLoadingSet({ state: 'loading', message: '' });

    fetchData(() => axios.get(`../api/v1/words/search/${search}`, { signal: abortController.signal }), navigate)
      .then((res) => loadData(res, setWords, setLoadingSet, (data) => data.filter(notFromTheSameSet)))
      .catch((e) => handleLoadingErrors(e, setLoadingSet)); 

    fetchData(() => axios.get(`../api/v1/dictionary/search/${search}`, { signal: abortController.signal }), navigate)
      .then((res) => loadData(res, setDiki, setLoadingDiki))
      .catch((e) => handleLoadingErrors(e, setLoadingDiki)); 
      
    return () => abortController.abort();
  }, [navigate, search, setId])

  const handleSelect = (data: WordData, type: 'create' | 'import') => {
    onSelect({ ...data, type, error: {}})
  }

  return ( 
    <>
      <Container paddingBottom={0}>
        <StyledTypography align="center" variant="h6" fontWeight="normal">
          Import word definition from an online dictionary or from one of your sets, you can also add your own custom definition
        </StyledTypography>
      </Container>

      <SearchFrom
        defaultValue={search}
        label="Search world"
        onSubmit={setSearch}
      />
      
      <Loading timeout={10000} {...loadingSet}>
        <Masonry itemWidth={500}>
          {
            words.map((word) => (
              <WordCard
                key={word.id}
                data={word}   
                onClick={() => handleSelect(word, 'import')}
                icons={[<UsedInInfoIcon key="0" usedIn={word.usedIn} />]}
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
                data={word}
                onClick={() => handleSelect(word, 'create')}
              />
            ))
          }   
        </Masonry>
      </Loading>
    </>
  )
}