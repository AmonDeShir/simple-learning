import { Typography } from "@mui/material";
import { forwardRef } from "react";
import { useOpenPage, useNavigationArgument } from 'animated-router-react';
import { ButtonContainer, StyledForm, StyledPaper } from "./reset-password-message.styles";
import { Button } from "../../../../components/styles/styles";

export const ResetPasswordMessage = forwardRef<HTMLDivElement>((_, ref) => {
  const openPage = useOpenPage();
  const message = useNavigationArgument<string>();

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
            onClick={() => openPage('/log-in', { updateHistory: true })}
          >Ok</Button>
        </ButtonContainer>
      </StyledForm>
    </StyledPaper>
  );
})