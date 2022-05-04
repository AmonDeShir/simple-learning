import { Typography } from "@mui/material";
import { forwardRef, useEffect, useRef } from "react";
import { useOpenPage } from 'animated-router-react';
import { useAppDispatch } from "../../../redux/store";
import { hideLoginPage, setUserData } from "../../../redux/slices/users/user";
import { ButtonContainer, StyledButton, StyledForm, StyledPaper } from "./use-without-account.styles";
import axios from "axios";

export const UseWithoutAccount = forwardRef<HTMLDivElement>((_, ref) => {
  const abortController = useRef(new AbortController());

  const openPage = useOpenPage();
  const dispatch = useAppDispatch();

  useEffect(() => {
    axios({ url: '/api/v1/auth/refresh', method: 'POST', signal: abortController.current.signal })
      .then(res => res.data.data)
      .then(data => {
        dispatch(setUserData({...data }));
        dispatch(hideLoginPage());
        openPage('/', { updateHistory: true });
      })
      .catch(() => {});
  }, [dispatch, openPage]);

  const createNoSyncAccount = () => {
    axios({ url: '/api/v1/auth/use-no-sync', method: 'POST', signal: abortController.current.signal })
      .then(res => res.data.data)
      .then(data => {
        dispatch(setUserData({...data }));
        dispatch(hideLoginPage());
        openPage('/', { updateHistory: true });
      })
  }

  useEffect(() => () => abortController.current.abort(), []);

  return (
    <StyledPaper ref={ref} elevation={10}>
      <StyledForm noValidate autoComplete="off">
        <Typography
          variant="h6" 
          component={"h2"}
          align="center"
          padding="0 0 20px 0"
        >
          You don't need an account to use this service,
          but you will need one if you want to synchronize your progress between devices.
        </Typography>

        <ButtonContainer>
          <StyledButton
            width="medium"
            color="primary"
            variant="contained"
            onClick={createNoSyncAccount}
          >Use without account</StyledButton>
            
          <StyledButton
            width="small"
            color="primary"
            variant="contained"
            onClick={() => openPage('/log-in', { updateHistory: true })}
          >Log in</StyledButton>
          
          <StyledButton
            width="small"
            color="primary"
            variant="contained"
            onClick={() => openPage('/register', { updateHistory: true })}
          >Register</StyledButton>
        </ButtonContainer>
      </StyledForm>
    </StyledPaper>
  );
});