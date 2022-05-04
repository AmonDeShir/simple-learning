import { Typography } from "@mui/material";
import { useOpenPage } from 'animated-router-react';
import { forwardRef } from "react";
import { Button } from "../../../../components/styles/styles";
import { ButtonContainer, StyledForm, StyledPaper } from "./receive-email.styles";

export const ReceiveEmail = forwardRef<HTMLDivElement>((_, ref) => {
  const openPage = useOpenPage();

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
            onClick={() => openPage('/log-in', { updateHistory: true })}
          >Ok</Button>
        </ButtonContainer>
      </StyledForm>
    </StyledPaper>
  );
});