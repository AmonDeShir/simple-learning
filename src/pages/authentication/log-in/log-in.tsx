import axios from "axios";
import { Button, makeStyles, Paper, TextField, Grid, Typography, Box } from "@material-ui/core";
import { forwardRef, useEffect, useState } from "react";
import { useOpenPage } from 'animated-router-react';
import { useForm } from 'react-hook-form'
import { useAppDispatch } from "../../../redux/store";
import { hideLoginPage, setUserData } from "../../../redux/slices/users/user";

const useStyles = makeStyles({
  TextField: {
    marginTop: 25,
    marginBottom: 10,
    "& .MuiOutlinedInput-root": {
      '& fieldset': {
        borderColor: '#ba6642',
        borderWidth: '0.2em'
      },
      '&:hover fieldset': {
        borderColor: '#f0956e',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#ba6642',
        borderWidth: '0.2em'
      },
    }
  },

  Link: {
    cursor: 'pointer',
  }
});

type Option = {
  email: string;
  password: string;
};

export const LogIn = forwardRef<HTMLElement>((_, ref) => {
  const classes = useStyles();
  const [ error, setError ] = useState('');
  const { register, handleSubmit } = useForm<Option>();
  const openPage = useOpenPage();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const abortController = new AbortController();

    axios({ url: '/api/v1/auth/refresh', method: 'POST', signal: abortController.signal })
    .then(res => res.data.data)
    .then(data => {
      dispatch(setUserData({...data, synchronize: true }));
      dispatch(hideLoginPage());
      openPage('/', { updateHistory: true });
    })
    .catch(() => {});

    return () => abortController.abort();
  }, [dispatch, openPage]);

  const onSubmit = handleSubmit(({ email, password }) => {
    setError(``);

    if (email.length === 0 || password.length === 0) {
      setError(`Please enter email and password`);
      return;
    }

    axios({ url: '/api/v1/auth/log-in', method: 'POST', data: { email, password }})
    .then(res => res.data.data)
    .then(data => {
      dispatch(setUserData({...data, synchronize: true }));
      dispatch(hideLoginPage());
      openPage('/', { updateHistory: true });
    })
    .catch((error) => {
      setError(error.response?.data?.message ?? 'Logging in failed');
    })
  });

  return (
    <Paper ref={ref} elevation={10} style={{ margin: '2.5%' }}>
      <form noValidate autoComplete="off" onSubmit={onSubmit} style={{ padding: '10% 10% 5% 10%' }}>
        <Typography
          variant="h5" 
          component={"h2"}
          align="center"
        >Write your email and password below</Typography>

        <TextField
          className={classes.TextField}
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
              style={{padding: '10px 0'}}
            >You don't have account?</Typography>
          </Grid>

          <Grid item xs={4} sm={4} md={4}>
            <Typography
              className={classes.Link}
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

        <TextField
          className={classes.TextField}
          type="password"
          label="Password"
          variant="outlined"
          color="primary"
          fullWidth
          inputProps={{ "data-testid": "password-text-field" }}
          {...register('password')}
        />

        <Grid container>
          <Grid item xs={8} sm={8} md={8} >
            <Typography
              variant="body2"
              align="center"
              style={{padding: '10px 0'}}
            >Do you forgot your password?</Typography>
          </Grid>

          <Grid item xs={4} sm={4} md={4}>
            <Typography
              className={classes.Link}
              variant="body2"
              color="primary"
              align="center"
              onClick={() => openPage('/send-email', { updateHistory: true })}
            >Click here</Typography>

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
          style={{ padding: '10px 0 20px 0', fontWeight: 'bold'}}
        >{error}</Typography>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="20px"
        >
          <Button
            style={{ width: '120px', paddingTop: '10px' }}
            type="submit"
            color="primary"
            variant="contained"
          >Log in</Button>
        </Box>
      </form>
    </Paper>
  );
});