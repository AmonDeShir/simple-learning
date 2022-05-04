import { styled } from '@mui/material/styles';
import {Typography, Box } from "@mui/material";

export const CenterPage = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  padding: 0 0 20px 0;
`;

export const StyledTypography = styled(Typography)`
  padding-top: 10px;
  padding-bottom: 5px;
`;

export const CreateNewSetContainer = styled(Box)`
  display: flex;
  max-width: 450px;
  padding: 20px 0 0 0;
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
`;