import axios from "axios";
import { Grid, Typography } from "@mui/material";
import { forwardRef, useState } from "react";
import { useOpenPage } from "animated-router-react";
import { useForm } from 'react-hook-form'
import { StyledPaper, StyledForm, StyledTextField, ButtonContainer } from "./register.styles";
import { Button, Link } from "../../../../components/styles/styles";

type Option = {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
};

export const Register = forwardRef<HTMLDivElement>((_, ref) => {
  const [ error, setError ] = useState('');
  const { register, handleSubmit } = useForm<Option>();
  const openPage = useOpenPage();

  const onSubmit = handleSubmit(({ email, name, password, repeatPassword }) => {
    setError(``);

    if(password !== repeatPassword) {
      setError(`Passwords do not match`);
      return;
    }

    if (email.length === 0 || name.length === 0 || password.length === 0) {
      setError(`Please enter username, email and password`);
      return;
    }

    axios({ url: '/api/v1/auth/register', method: 'POST', data: { email, name, password }})
    .then(() => {
      openPage('/authenticate-your-email', { updateHistory: true })
    })
    .catch((error) => {
      setError(error.response?.data?.message ?? 'Registration failed');
    })
  });

  return (
    <StyledPaper ref={ref} elevation={10}>
      <StyledForm noValidate autoComplete="off" onSubmit={onSubmit}>
        <Typography
          variant="h5" 
          component={"h2"}
          align="center"
        >Write your email and password below</Typography>

        <StyledTextField
          margin="dense" 
          label="Name"
          variant="outlined"
          color="primary"
          fullWidth
          inputProps={{ "data-testid": "name-text-field" }}
          {...register('name')}
        />

        <StyledTextField
          margin="dense" 
          type="email"
          label="Email"
          variant="outlined"
          color="primary"
          fullWidth
          inputProps={{ "data-testid": "email-text-field" }}
          {...register('email')}
        />

        <Grid container>
          <Grid item xs={8} sm={8} md={8} >
            <Typography
              align="center"
              variant="body2"
              padding="10px 0"
            >Do you have account?</Typography>
          </Grid>
            
          <Grid item xs={4} sm={4} md={4}>
            <Link
              color="primary"
              align="center"
              variant="body2"
              onClick={() => openPage('/log-in', { updateHistory: true })}
            >Click here</Link>
            
            <Typography
              align="center"
              variant="body2"
            >to log in.</Typography>
          </Grid>
        </Grid>


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
          style={{padding: '10px 0'}}
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
          >Register</Button>
        </ButtonContainer>
      </StyledForm>
    </StyledPaper>
  );
});