import { Button, Paper, Typography, Box } from "@material-ui/core";
import { forwardRef } from "react";
import { useOpenPage, useNavigationArgument } from 'animated-router-react';

export const ResetPasswordMessage = forwardRef<HTMLElement>((_, ref) => {
  const openPage = useOpenPage();
  const message = useNavigationArgument<string>();

  return (
    <Paper ref={ref} elevation={10} style={{ margin: '10%' }}>
      <form noValidate autoComplete="off" style={{ padding: '5% 5% 3% 5%' }} >
        <Typography
          variant="h6" 
          component={"h2"}
          align="center"
        >{message}</Typography>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="20px"
          style={{"marginTop": "25px"}}
        >
          <Button
            style={{ width: '120px', paddingTop: '10px' }}
            type="submit"
            color="primary"
            variant="contained"
            onClick={() => openPage('/log-in', { updateHistory: true })}
          >Ok</Button>
        </Box>
      </form>
    </Paper>
  );
})