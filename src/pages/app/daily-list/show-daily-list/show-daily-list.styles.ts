import { styled } from '@mui/material/styles';
import {Typography, Box } from "@mui/material";
import { Button } from '../../../../components/styles/styles';

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
  padding-bottom: 10px;
`;

export const LearnContainer = styled(Box)`
  margin-top: 10px;
  margin-bottom: 10px;
  position : relative;
  width: 100%;
`;

export const LearnButton = styled(Button)`
  position: absolute;
  top: 0px;
  right: 20px;
  height: 100%;
`;