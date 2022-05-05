import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import axios from "axios";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchData } from "../../../../api/fetchData";
import { AnimatedIcon } from "../../../../components/animated-icon/animated-icon";
import { FlippingCard } from "../../../../components/flipping-card/flipping-card";
import { Header } from "../../../../components/header/header";
import { Loading, RegisterLoading } from "../../../../components/loading/loading";
import { Masonry } from "../../../../components/masonry/masonry";
import { LearnItem } from "../../../../redux/slices/learn/learn.types";
import { useAppDispatch } from "../../../../redux/store";
import { handleLoadingErrors, loadData } from "../../../../utils/load-data/load-data";
import { CenterPage, LearnButton, LearnContainer, StyledTypography } from "./show-daily-list.styles";
import { useNavigate } from 'react-router-dom';

export const ShowDailyList = () => {
  const [ data, setData ] = useState<LearnItem[][]>([[]]);
  const [ loading, setLoading ] = useState<RegisterLoading>({ state: 'loading', message: '' });

  const dayOfMonth = new Date().getDate();
  const monthName = new Date().toLocaleString("en-us", { month: "long" });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();

    setLoading({ state: 'loading', message: '' })

    fetchData(() => axios.get(`/api/v1/words/month-list`, { signal: abortController.signal }), dispatch)
      .then(res => loadData(res, setData, setLoading))
      .catch(e => handleLoadingErrors(e, setLoading));

    return () => abortController.abort();
  }, [dispatch]);

  const openSetPage = (word: LearnItem) => {
    navigate(`/set/${word.id}`);
  }

  return (
    <CenterPage>
      <Header title="Daily List" />
      <Loading timeout={20000} {...loading}>
        <LearnContainer>
          <Typography align="center" variant="h6">
            Today
          </Typography>
          
          <LearnButton type="submit" color="primary">Learn</LearnButton>
        </LearnContainer>


        <Masonry itemWidth={500}>
          {
            data[0].map((word) => (
              <FlippingCard 
                data={{...word, inGameId: ''}} 
                key={word.id} 
                width="90%" 
                muteOnMount
                icons={[
                  <AnimatedIcon 
                    key="0" 
                    Icon={FileOpenOutlinedIcon} 
                    onClick={() => openSetPage(word)}
                    size={25}
                  />
                ]}
              />
            ))
          }
        </Masonry>

        {
          data.slice(1).map((items, index) => items.length > 0 && (
            <Box key={index} width="100%" height="100%">
              <StyledTypography align="center" variant="h6">
                {dayOfMonth + index}th {monthName}
              </StyledTypography>

              <Masonry itemWidth={500}>
              {
                items.map((word) => (
                  <FlippingCard 
                    muteOnMount 
                    key={word.id} 
                    width="90%" 
                    data={{...word, inGameId: ''}} 
                    icons={[
                      <AnimatedIcon 
                        key="0" 
                        Icon={FileOpenOutlinedIcon} 
                        onClick={() => openSetPage(word)} 
                        size={25}
                      />
                    ]}
                  />
                ))
              }
              </Masonry>
            </Box>
          ))
        }
      </Loading>
    </CenterPage>
  );
}

