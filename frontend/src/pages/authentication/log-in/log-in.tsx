import axios from "axios";
import { Grid, Typography, Box } from "@mui/material";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useForm } from 'react-hook-form'
import { useAppDispatch } from "../../../redux/store";
import { setUserData } from "../../../redux/slices/users/user";
import { StyledForm, StyledPaper } from "./log-in.styles";
import { Button, Link, TextField } from "../../../components/styles/styles";
import { useNavigate } from "react-router-dom";

type Option = {
  email: string;
  password: string;
};

export const LogIn = forwardRef<HTMLDivElement>((_, ref) => {
  const abortController = useRef(new AbortController());
  const [ error, setError ] = useState('');
  const { register, handleSubmit } = useForm<Option>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = handleSubmit(({ email, password }) => {
    setError(``);

    if (email.length === 0 || password.length === 0) {
      setError(`Please enter email and password`);
      return;
    }

    axios.post('/api/v1/auth/log-in', { email, password }, { signal: abortController.current.signal })
      .then(res => res.data.data)
      .then(data => {
        dispatch(setUserData({...data }));
        navigate('/');
      })
      .catch((error) => {
        if (error.message !== 'canceled') {
          setError(error.response?.data?.message ?? 'Logging in failed');
        }
      })
  });

  useEffect(() => () => abortController.current.abort(), []);

  return (
    <StyledPaper ref={ref} elevation={10}>
      <StyledForm noValidate autoComplete="off" onSubmit={onSubmit}>
        <Typography
          variant="h5" 
          component={"h2"}
          align="center"
          padding="0 0 20px 0"
        >Write your email and password below</Typography>

        <TextField
          type="email"
          label="Email"
          variant="outlined"
          color="primary"
          fullWidth
          inputProps={{ "data-testid": "email-text-field" }}
          {...register('email')}
        />

        <Grid container padding="5px 0 20px 0">
          <Grid item xs={8} sm={8} md={8} >
            <Typography
              align="center"
              variant="body2"
              padding="10px 0"
            >You don't have account?</Typography>
          </Grid>

          <Grid item xs={4} sm={4} md={4}>
            <Link
              color="primary"
              align="center"
              variant="body2"
              onClick={() => navigate('/auth/register')}
            >Click here</Link>
            
            <Typography
              align="center"
              variant="body2"
            >to register.</Typography>
          </Grid>
        </Grid>

        <TextField
          type="password"
          label="Password"
          variant="outlined"
          color="primary"
          fullWidth
          inputProps={{ "data-testid": "password-text-field" }}
          {...register('password')}
        />

        <Grid container padding="5px 0 0 0">
          <Grid item xs={8} sm={8} md={8}>
            <Typography
              variant="body2"
              align="center"
              style={{padding: '10px 0'}}
            >Do you forgot your password?</Typography>
          </Grid>

          <Grid item xs={4} sm={4} md={4}>
            <Link
              variant="body2"
              color="primary"
              align="center"
              onClick={() => navigate('/auth/send-email')}
            >Click here</Link>

            <Typography
              variant="body2"
              align="center"
            >to reset it.</Typography>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          align="right"
          color="error"
          padding="10px 0 20px 0"
          fontWeight="bold"
        >{error}</Typography>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="20px"
        >
          <Button
            type="submit"
            color="primary"
            variant="contained"
          >Log in</Button>
        </Box>
      </StyledForm>
    </StyledPaper>
  );
});