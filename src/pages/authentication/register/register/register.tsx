import axios from "axios";
import { Button, makeStyles, Paper, TextField, Grid, Typography, Box } from "@material-ui/core";
import { forwardRef, useState } from "react";
import { useOpenPage } from "animated-router-react";
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
  },

  Link: {
    cursor: 'pointer',
  }
});

type Option = {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
};


export const Register = forwardRef<HTMLElement>((_, ref) => {
  const classes = useStyles();
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
    <Paper ref={ref} elevation={10} style={{ margin: '2.5%' }}>
      <form noValidate autoComplete="off" onSubmit={onSubmit} style={{ padding: '10% 10% 5% 10%' }} >
        <Typography
          variant="h5" 
          component={"h2"}
          align="center"
        >Write your email and password below</Typography>

        <TextField
          className={classes.TextField}  
          label="Name"
          variant="outlined"
          color="primary"
          fullWidth
          inputProps={{ "data-testid": "name-text-field" }}
          {...register('name')}
        />

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
            >Do you have account?</Typography>
          </Grid>
            
          <Grid item xs={4} sm={4} md={4}>
            <Typography
              className={classes.Link}
              color="primary"
              align="center"
              variant="body2"
              onClick={() => openPage('/log-in', { updateHistory: true })}
            >Click here</Typography>
            
            <Typography
              align="center"
              variant="body2"
            >to log in.</Typography>
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
          >Register</Button>
        </Box>
      </form>
    </Paper>
  );
});