import axios from 'axios';
import { Typography } from "@mui/material";
import { forwardRef, useState, useEffect } from "react";
import { ButtonContainer, StyledForm, StyledPaper } from './email-authentication.styles';
import { Button } from '../../../../components/styles/styles';
import { useNavigate } from 'react-router-dom';

export const EmailAuthentication = forwardRef<HTMLDivElement, { token: string }>(({ token }, ref) => {
  const [ message, setMessage ] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();

    axios({ url: '/api/v1/auth/confirm-account', method: 'POST', data: { token }, signal: abortController.signal })
    .then(() => {
      setMessage('Your account has been confirmed. You can now log in.');
    })
    .catch((error) => {
      if (error.message !== 'canceled') {
        setMessage(error.response?.data?.message ?? 'Authentication failed.');
      }
    })

    return () => abortController.abort();
  }, [token]);

  return (
    <StyledPaper ref={ref} elevation={10}>
      <StyledForm noValidate autoComplete="off">
        <Typography
          variant="h6" 
          component={"h2"}
          align="center"
        >
          { message.length > 0 ? message : 'Please wait, your email address is now being authenticated...'}
        </Typography>
        
        { message.length > 0 && 
          <ButtonContainer>
            <Button
              color="primary"
              variant="contained"
              onClick={() => navigate('/auth/log-in')}
            >Ok</Button>
          </ButtonContainer>
        }
      </StyledForm>
    </StyledPaper>
  );
})