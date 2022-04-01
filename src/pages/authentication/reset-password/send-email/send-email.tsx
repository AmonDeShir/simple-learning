import axios from "axios";
import { Button, makeStyles, Paper, TextField, Grid, Typography, Box } from "@material-ui/core";
import { useOpenPage } from 'animated-router-react';
import { forwardRef, useState } from "react";
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

  Link: {
    cursor: 'pointer',
  }
});

type Option = {
  email: string;
};


export const SendEmail = forwardRef<HTMLElement>((_, ref) => {
  const classes = useStyles();
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
    <Paper ref={ref} elevation={10} style={{ margin: '2.5%', minWidth: '400px' }}>
      <form noValidate onSubmit={onSubmit} autoComplete="off" style={{ padding: '10% 10% 5% 10%' }} >
        <Typography
          variant="h5" 
          component={"h2"}
          align="center"
        >Write your email below</Typography>

        <TextField
          className={classes.TextField}  
          label="Email"
          variant="outlined"
          color="primary"
          fullWidth
          inputProps={{ "data-testid": "email-text-field" }}
          {...register("email")}
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
          style={{ padding: '10px 0 20px 0', fontWeight: 'bold'}}
        >{error}</Typography>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="20px"
          style={{"marginTop": "10px"}}
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