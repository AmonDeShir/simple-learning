import { Typography } from "@mui/material";
import { forwardRef } from "react";
import { useOpenPage } from 'animated-router-react';
import { ButtonContainer, StyledForm, StyledPaper } from "./authenticate-your-email.styles";
import { Button } from "../../../../components/styles/styles";

export const AuthenticateYourEmail = forwardRef<HTMLDivElement>((_, ref) => {
  const openPage = useOpenPage();

  return (
    <StyledPaper ref={ref} elevation={10}>
      <StyledForm noValidate autoComplete="off">
        <Typography
          variant="h6" 
          component={"h2"}
          align="center"
        >On your email address was sent message with with instructions how to authenticate your account.</Typography>
        
        <ButtonContainer>
          <Button
            style={{ width: '120px', paddingTop: '10px' }}
            color="primary"
            variant="contained"
            onClick={() => openPage('/log-in', { updateHistory: true })}
          >Ok</Button>
        </ButtonContainer>
      </StyledForm>
    </StyledPaper>
  );
});