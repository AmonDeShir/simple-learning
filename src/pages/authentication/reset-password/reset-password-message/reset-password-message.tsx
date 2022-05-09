import { Typography } from "@mui/material";
import { forwardRef } from "react";
import { ButtonContainer, StyledForm, StyledPaper } from "./reset-password-message.styles";
import { Button } from "../../../../components/styles/styles";
import { useNavigate } from "react-router-dom";

export const ResetPasswordMessage = forwardRef<HTMLDivElement, { message: string }>(({ message }, ref) => {
  const navigate = useNavigate();

  return (
    <StyledPaper ref={ref} elevation={10}>
      <StyledForm noValidate autoComplete="off">
        <Typography
          variant="h6" 
          component={"h2"}
          align="center"
        >{message}</Typography>

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
})