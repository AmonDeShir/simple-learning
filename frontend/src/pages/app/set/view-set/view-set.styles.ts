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

export const ActionButtons = styled(Box)`
  max-width: 1000px;
  width: 90%;
  margin: 20px 0px 10px 0px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SearchSecondContainer = styled(Box)`
  display: flex;
  width:  100%;
  justify-content: space-between;
`;

export const StyledTypography = styled(Typography)`
  padding: 0px 10px 10px 10px;

  @media (min-width: 1024px) {
    width: calc(100% - (135px * 4));
    padding: 0px;
  }
`;
