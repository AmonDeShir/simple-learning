import { Typography } from "@mui/material";
import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/styles/styles";
import { ButtonContainer, StyledForm, StyledPaper } from "./receive-email.styles";

export const ReceiveEmail = forwardRef<HTMLDivElement>((_, ref) => {
  const navigate = useNavigate();

  return (
    <StyledPaper ref={ref} elevation={10}>
      <StyledForm noValidate autoComplete="off">
        <Typography
          variant="h6" 
          component={"h2"}
          align="center"
        >On your email address was sent message with instructions how to reset our password.</Typography>

        <ButtonContainer>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            onClick={() => navigate('/auth/log-in')}
          >Ok</Button>
        </ButtonContainer>
      </StyledForm>
    </StyledPaper>
  );
});