import axios from "axios";
import { Typography, useMediaQuery } from "@mui/material";
import { ProgressChart } from "../../../components/progress-chart/progress-chart";
import { SetsMasonry } from "../../../components/sets-masonry/sets-masonry";
import { Header } from "../../../components/header/header";
import { Button } from "../../../components/styles/styles";
import { SetsCarousel } from "../../../components/sets-carousel/sets-carousel";
import { useNavigate } from "react-router-dom";
import { CenterPage, LearnEditContainer, LearnEditSecondContainer, OpenSetListGrid, StyledTypography } from "./main.styles";
import { SearchFrom } from "../../../components/search-from/search-form";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { SuperMemoPhase } from '../../../super-memo/super-memo.types';
import { useEffect, useState } from "react";
import { fetchData } from '../../../api/fetchData';
import { Loading, RegisterLoading } from "../../../components/loading/loading";
import { handleLoadingErrors, loadData } from "../../../utils/load-data/load-data";

type Set = {
  id: string;
  title: string;
  progress: { [key in SuperMemoPhase]: number };
  words?: {
    id: string,
    word: string,
    meaning: string,
  }[];
}

const Main = () => {
  const username = useAppSelector(({ user }) =>  user.name);
  const matchesPC = useMediaQuery('(min-width:1024px)');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [ data, setData ] = useState<Set[]>([])
  const [ loading, setLoading ] = useState<RegisterLoading>({ state: 'loading', message: '' });

  const openDictionary = (search: string) => {
    navigate(`/dictionary/${search}`);
  }

  useEffect(() => {
    const abortController = new AbortController();

    setLoading({ state: 'loading', message: '' });

    fetchData(() => axios.get('/api/v1/sets/', { signal: abortController.signal }), dispatch)
      .then((res) => loadData(res, setData, setLoading))
      .catch(e => handleLoadingErrors(e, setLoading));

    return () => abortController.abort();
  }, [dispatch]);

  return (
    <CenterPage>
      <Header title={`Hi ${username}`} />
      <SearchFrom
        title="Search word in database and diki"
        label="Search word"
        onSubmit={openDictionary}
      />

      <ProgressChart />
      
      <LearnEditContainer>
        <StyledTypography align="center" variant="h6">Learn your daily list</StyledTypography>

        <LearnEditSecondContainer>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            onClick={() => navigate('/learn')}
          >Learn</Button>

          <Button
            type="submit"
            color="primary"
            variant="contained"
            onClick={() => navigate('/daily-list')}
          >Show</Button>
        </LearnEditSecondContainer>
      </LearnEditContainer>

      <StyledTypography align="center" variant="h6">Select last used set</StyledTypography>
      
      <Loading timeout={10000} {...loading}> 
        {
          matchesPC 
            ? <SetsMasonry sets={data} onClick={(set) => navigate(`/set/${set.id}`)} /> 
            : <SetsCarousel sets={data} onClick={(set) => navigate(`/set/${set.id}`)} /> 
        }
      </Loading>

      <OpenSetListGrid>
        <Typography align="center" variant="h6">
          or select one from the set list
        </Typography>
        
        <Button
          type="submit"
          color="primary"
          variant="contained"
          onClick={() => navigate('/set-list')}
        >Open set list</Button>
      </OpenSetListGrid>
    </CenterPage>
  );
}

export default Main;