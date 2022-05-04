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

export const Container = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 2.5% 10%;
    max-width: 800px;
    width: 90%;

    ${({ theme }) => theme.breakpoints.up('md')} {
      padding: 25px 100px;
    }
`;

export const SaveCancelContainer = styled(Box)`
  display: flex;
  width:  100%;
  justify-content: space-evenly;
  margin-top: 20px;
`;

export const StyledTypography = styled(Typography)`
  padding-top: 10px;
  padding-bottom: 5px;
`;


export const TextWithButton = styled(Box)`
  display: flex;
  padding: 20px 0 0 0;
  width: 100%;
  justify-content: center;
  align-items: center;
`;