import { Button, Paper, Typography, Box } from "@material-ui/core";
import { forwardRef } from "react";
import { useOpenPage } from 'animated-router-react';
import { useAppDispatch } from "../../../redux/store";
import { hideLoginPage } from "../../../redux/slices/users/user";

export const UseWithoutAccount = forwardRef<HTMLElement>((_, ref) => {
  const openPage = useOpenPage();
  const dispatch = useAppDispatch();

  return (
    <Paper ref={ref} elevation={10} style={{ margin: '10%' }}>
      <form noValidate autoComplete="off" style={{ padding: '5% 5% 3% 5%' }} >
        <Typography
          variant="h6" 
          component={"h2"}
          align="center"
        >
          You don't need an account to use this service,
          but you will need one if you want to synchronize your progress between devices.
        </Typography>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="20px"
          style={{"marginTop": "25px", flexWrap: 'wrap'  }}
        >
          <Button
            style={{ width: '240px', paddingTop: '10px', margin: '2.5px 5px'}}
            color="primary"
            variant="contained"
            onClick={() => { dispatch(hideLoginPage()) }}
          >Use without account</Button>
            
          <Button
            style={{ width: '120px', paddingTop: '10px', margin: '2.5px 5px' }}
            color="primary"
            variant="contained"
            onClick={() => openPage('/log-in', { updateHistory: true })}
          >Log in</Button>
          
          <Button
            style={{ width: '120px', paddingTop: '10px', margin: '2.5px 5px' }}
            color="primary"
            variant="contained"
            onClick={() => openPage('/register', { updateHistory: true })}
          >Register</Button>
        </Box>
      </form>
    </Paper>
  );
});