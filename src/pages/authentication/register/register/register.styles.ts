import { Box, Paper, styled } from "@mui/material";
import { TextField } from "../../../../components/styles/styles";

export const StyledPaper = styled(Paper)`
  margin: 2.5%;
`;

export const StyledForm = styled("form")`
  padding: 10% 10% 5% 10%;
`;

export const StyledTextField = styled(TextField)`
  margin: ${({ margin }) => ({ undefined: '0', none: '0', dense: '25px 0 10px 0', normal: '0 0 10px 0' }[`${margin}`])};
`;

export const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 20px;
`;

