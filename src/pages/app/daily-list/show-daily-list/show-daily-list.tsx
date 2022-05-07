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
import { handleLoadingErrors } from "../../../../utils/load-data/load-data";
import { CenterPage, LearnButton, LearnContainer, StyledTypography } from "./show-daily-list.styles";
import { useNavigate, useParams } from 'react-router-dom';
import { IconInfo } from '../../../../components/info-icon/info-icon';
import { Button } from '../../../../components/styles/styles';
import { loadAdvancedData } from '../../../../utils/load-data/load-advanced-data';
import { Empty } from '../../../../components/loading/empty/empty';

type ServerResponse = { date: number, days: LearnItem[][], isLastPage: boolean };

export const ShowDailyList = () => {
  const params = useParams();
  const page = Number(params.page ?? "0");
  const [ data, setData ] = useState<ServerResponse>({ date: 0, days: [[]], isLastPage: false });
  const [ loading, setLoading ] = useState<RegisterLoading>({ state: 'loading', message: '' });

  const dayOfMonth = new Date(data.date).getDate();
  const monthName = new Date(data.date).toLocaleString("en-us", { month: "long" });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (page < 0) {
      navigate("/daily-list");
    }
  }, [navigate, page]);

  useEffect(() => {
    const abortController = new AbortController();

    setLoading({ state: 'loading', message: '' })

    fetchData(() => axios.get(`/api/v1/words/month-list/${page}`, { signal: abortController.signal }), dispatch)
      .then(res => loadAdvancedData(res, (data: ServerResponse) => data.days, (days, data) => ({ ...data, days }), setData, setLoading))
      .catch(e => handleLoadingErrors(e, setLoading));

    return () => abortController.abort();
  }, [dispatch, page]);

  const openSetPage = (word: LearnItem) => {
    navigate(`/set/${word.set}`);
  }
  
  const messageAboutProgress = (item: LearnItem) => {
    const time = new Date(item.progress.nextRepetition).toLocaleTimeString("en-us", { day: '2-digit', month: '2-digit', year: 'numeric', hour: "2-digit", minute: "2-digit" });

    return `Next\xa0repetition:\xa0${time}, Learning\xa0phase:\xa0${item.progress.phase}`;
  }

  return (
    <CenterPage>
      <Header title="Daily List" />
      <Loading timeout={20000} {...loading}>
        { page === 0 && (
          <>
            <LearnContainer>
              <Typography align="center" variant="h6">
                Today
              </Typography>
              
              <LearnButton type="submit" color="primary" onClick={() => navigate('/learn')}>Learn</LearnButton>
            </LearnContainer>
            
            <Masonry itemWidth={500}>
              { data.days[0].length === 0 && <Empty noBackground message="There is nothing to learn for today"/> }
              {
                data.days[0].map((word) => (
                  <FlippingCard 
                    data={{...word, inGameId: ''}} 

                    width="90%" 
                    muteOnMount
                    icons={[
                      <AnimatedIcon 
                        key="0" 
                        Icon={FileOpenOutlinedIcon} 
                        onClick={() => openSetPage(word)}
                        size={25}
                      />,
                      <IconInfo
                        key="1"
                        text={messageAboutProgress(word)}
                      />
                    ]}
                  />
                ))
              }
            </Masonry>
          </>
        )}
        {
          data.days.slice(page === 0 ? 1 : 0).map((items, index) => items.length > 0 && (
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
                      />,
                      <IconInfo
                        key="1"
                        text={messageAboutProgress(word)}
                      />
                    ]}
                  />
                ))
              }
              </Masonry>
            </Box>
          ))
        }

        <Box display="flex" justifyContent="space-between" padding="0 10px">
          <Button color="primary" disabled={page <= 0} onClick={() => navigate(`/daily-list/${page - 1}`)}>Previous</Button>
          <Button color="primary" disabled={data.isLastPage} onClick={() => navigate(`/daily-list/${page + 1}`)}>Next</Button>
        </Box>
      </Loading>
    </CenterPage>
  );
}

