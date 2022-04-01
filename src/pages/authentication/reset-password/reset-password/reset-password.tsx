import axios from "axios";
import { Button, makeStyles, Paper, TextField, Typography, Box } from "@material-ui/core";
import { forwardRef, useState } from "react";
import { useOpenPage, useNavigationArgument } from 'animated-router-react';
import { useForm } from 'react-hook-form'

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

  TextField2: {
    marginTop: 0,
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
  }
});

type Option = {
  password: string;
  repeatPassword: string;
};

export const ResetPassword = forwardRef<HTMLElement>((_, ref) => {
  const classes = useStyles();
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
    <Paper ref={ref} onSubmit={onSubmit} elevation={10} style={{ margin: '2.5%', minWidth: '400px' }}>
      <form noValidate autoComplete="off" style={{ padding: '10% 10% 5% 10%' }} >
        <Typography
          variant="h5" 
          component={"h2"}
          align="center"
        >Write your new password below</Typography>
      
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
      
        <Typography
          variant="body1"
          align="center"
          style={{padding: '10px 0'}}
        >Repeat your password below</Typography>
      
        <TextField
          className={classes.TextField2}
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
          >Done</Button>
        </Box>
      </form>
    </Paper>
  );
});