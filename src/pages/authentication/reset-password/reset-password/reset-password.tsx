import axios from "axios";
import { Typography } from "@mui/material";
import { forwardRef, useState } from "react";
import { useOpenPage, useNavigationArgument } from 'animated-router-react';
import { useForm } from 'react-hook-form'
import { Button } from "../../../../components/styles/styles";
import { ButtonContainer, StyledForm, StyledPaper, StyledTextField } from "./reset-password.styles";

type Option = {
  password: string;
  repeatPassword: string;
};

export const ResetPassword = forwardRef<HTMLDivElement>((_, ref) => {
  const [ error, setError ] = useState('');
  const token = useNavigationArgument<string>();
  const { register, handleSubmit } = useForm<Option>();
  const openPage = useOpenPage();

  const onSubmit = handleSubmit(({ password, repeatPassword }) => {
    setError(``);

    if(password !== repeatPassword) {
      setError(`Passwords do not match`);
      return;
    }

    if (password.length === 0) {
      setError(`Please enter your new password`);
      return;
    }

    axios({ url: '/api/v1/auth/reset-password', method: 'POST', data: { token, password }})
    .then(() => {
      openPage('/reset-password-message', { updateHistory: false, argument: 'Your password was changed successfully.'})
    })
    .catch((error) => {
      setError(error.response?.data?.message ?? 'Operation failed');

      if (error.response?.data.status === 403) {
        openPage('/reset-password-message', { updateHistory: false, argument: error.response?.data?.message })
      }
    })
  });

  return (
    <StyledPaper ref={ref} onSubmit={onSubmit} elevation={10}>
      <StyledForm noValidate autoComplete="off">
        <Typography
          variant="h5" 
          component={"h2"}
          align="center"
        >Write your new password below</Typography>
      
        <StyledTextField
          margin="dense"
          type="password"
          label="Password"
          variant="outlined"
          color="primary"
          fullWidth
          inputProps={{ "data-testid": "password-text-field" }}
          {...register('password')}
        />
      
        <Typography
          variant="body1"
          align="center"
          padding="0 0 10px 0"
        >Repeat your password below</Typography>
      
        <StyledTextField
          margin="normal"
          type="password"
          label="Password"
          variant="outlined"
          color="primary"
          fullWidth
          inputProps={{ "data-testid": "repeat-password-text-field" }}
          {...register('repeatPassword')}
        />
      
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