import { Typography } from "@mui/material";
import { forwardRef } from "react";
import { ButtonContainer, StyledForm, StyledPaper } from "./authenticate-your-email.styles";
import { Button } from "../../../../components/styles/styles";
import { useNavigate } from "react-router-dom";

export const AuthenticateYourEmail = forwardRef<HTMLDivElement>((_, ref) => {
  const navigate = useNavigate();

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
            onClick={() => navigate('/auth/log-in')}
          >Ok</Button>
        </ButtonContainer>
      </StyledForm>
    </StyledPaper>
  );
});