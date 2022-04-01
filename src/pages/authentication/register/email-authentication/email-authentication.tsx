import axios from 'axios';
import { Button, Paper, Typography, Box } from "@material-ui/core";
import { forwardRef, useState, useEffect } from "react";
import { useOpenPage, useNavigationArgument } from 'animated-router-react';

export const EmailAuthentication = forwardRef<HTMLElement>((_, ref) => {
  const [ message, setMessage ] = useState('');
  const token = useNavigationArgument<string>();
  const openPage = useOpenPage();

  useEffect(() => {
    const abortController = new AbortController();

    axios({ url: '/api/v1/auth/confirm-account', method: 'POST', data: { token }, signal: abortController.signal })
    .then(() => {
      setMessage('Your account has been confirmed. You can now log in.');
    })
    .catch((error) => {
      setMessage(error.response?.data?.message ?? 'Authentication failed.');
    })

    return () => abortController.abort();
  }, [token]);

  return (
    <Paper ref={ref} elevation={10} style={{ margin: '10%' }}>
      <form noValidate autoComplete="off" style={{ padding: '5% 5% 3% 5%' }} >
        <Typography
          variant="h6" 
          component={"h2"}
          align="center"
        >{ message.length > 0 ? message : 'Please wait, your email address is now being authenticated...'}</Typography>
        
        { message.length > 0 && 
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="20px"
            style={{"marginTop": "25px"}}
          >
            <Button
              style={{ width: '120px', paddingTop: '10px' }}
              color="primary"
              variant="contained"
              onClick={() => openPage('/log-in', { updateHistory: true })}
            >Ok</Button>
          </Box>
        }
      </form>
    </Paper>
  );
})