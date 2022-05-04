import { Box, Paper, styled } from "@mui/material";
import { TextField } from "../../../../components/styles/styles";

export const StyledPaper = styled(Paper)`
  margin: 2.5%;
  min-width: 400px;
`;

export const StyledForm = styled("form")`
  padding: 10% 10% 5% 10%;
`;

export const StyledTextField = styled(TextField)`
  margin: 25px 0 10px 0;
`;

export const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 20px;
  margin-top: 10px;
`;

