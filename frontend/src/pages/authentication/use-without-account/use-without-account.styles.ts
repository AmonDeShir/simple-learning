import { Box, Paper, styled } from "@mui/material";
import { Button, TextField } from "../../../components/styles/styles";

export const StyledPaper = styled(Paper)`
  margin: 10%;
`;

export const StyledForm = styled("form")`
  padding: 5% 5% 3% 5%;
`;

export const StyledTextField = styled(TextField)`
  margin: 25px 0 10px 0;
`;

export const ButtonContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  min-height: 20px;
  margin-top: 125x;
`;

type ButtonProps = {
  width: 'small' | 'medium';
}

export const StyledButton = styled(Button)<ButtonProps>`
  min-width: none;
  width: ${({ width }) => ({ small: '120px', medium: '240px' }[width])};
  height: 40px;
  margin: 5px 5px;
`;