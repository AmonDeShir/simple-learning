import axios from "axios";
import {Grid, Typography } from "@mui/material";
import { useOpenPage } from 'animated-router-react';
import { forwardRef, useState } from "react";
import { useForm } from 'react-hook-form'
import { Button, TextField } from "../../../../components/styles/styles";
import { ButtonContainer, StyledForm, StyledPaper } from "./send-email.styles";

type Option = {
  email: string;
};

export const SendEmail = forwardRef<HTMLDivElement>((_, ref) => {
  const [ error, setError ] = useState('');
  const { register, handleSubmit } = useForm<Option>();
  const openPage = useOpenPage();

  const onSubmit = handleSubmit(({ email }) => {
    setError(``);

    if (email.length === 0) {
      setError(`Please enter your email address`);
      return;
    }

    axios({ url: '/api/v1/auth/send-password-reset-email', method: 'POST', data: { email }})
    .then(() => {
      openPage('/receive-email', { updateHistory: true })
    })
    .catch((error) => {
      setError(error.response?.data?.message ?? 'Operation failed');
    })
  });

  return (
    <StyledPaper ref={ref} elevation={10}>
      <StyledForm noValidate onSubmit={onSubmit} autoComplete="off">
        <Typography
          variant="h5" 
          component={"h2"}
          align="center"
          padding="0 0 20px 0"
        >Write your email below</Typography>

        <TextField
          label="Email"
          variant="outlined"
          color="primary"
          fullWidth
          inputProps={{ "data-testid": "email-text-field" }}
          {...register("email")}
        />

        <Grid container padding="5px 0 0 0">
          <Grid item xs={8} sm={8} md={8} >
            <Typography
              align="center"
              variant="body2"
              padding="10px 0"
            >You don't have account?</Typography>
          </Grid>
          
          <Grid item xs={4} sm={4} md={4}>
            <Typography
              color="primary"
              align="center"
              variant="body2"
              onClick={() => openPage('/register', { updateHistory: true })}
            >Click here</Typography>
            
            <Typography
              align="center"
              variant="body2"
            >to register.</Typography>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          align="right"
          color="error"
          padding="10px 0 20px 0"
          fontWeight="bold"
        >{error}</Typography>

        <ButtonContainer>
          <Button
            type="submit"
            color="primary"
            variant="contained"
          >Done</Button>
        </ButtonContainer>
      </StyledForm>
    </StyledPaper>
  );
});