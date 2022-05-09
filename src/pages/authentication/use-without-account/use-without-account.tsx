import { Typography } from "@mui/material";
import { forwardRef, useEffect, useRef } from "react";
import { useAppDispatch } from "../../../redux/store";
import { setUserData } from "../../../redux/slices/users/user";
import { ButtonContainer, StyledButton, StyledForm, StyledPaper } from "./use-without-account.styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const UseWithoutAccount = forwardRef<HTMLDivElement>((_, ref) => {
  const abortController = useRef(new AbortController());

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    axios({ url: '/api/v1/auth/refresh', method: 'POST', signal: abortController.current.signal })
      .then(res => res.data.data)
      .then(data => {
        dispatch(setUserData({...data }));
        navigate('/');
      })
      .catch(() => {});
  }, [dispatch, navigate]);

  const createNoSyncAccount = () => {
    axios({ url: '/api/v1/auth/use-no-sync', method: 'POST', signal: abortController.current.signal })
      .then(res => res.data.data)
      .then(data => {
        dispatch(setUserData({...data }));
        navigate('/');
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
            onClick={() => navigate('/auth/log-in')}
          >Log in</StyledButton>
          
          <StyledButton
            width="small"
            color="primary"
            variant="contained"
            onClick={() => navigate('/auth/register')}
          >Register</StyledButton>
        </ButtonContainer>
      </StyledForm>
    </StyledPaper>
  );
});