import { styled } from '@mui/material/styles';
import { Box } from "@mui/material";

export const CenterPage = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  height: 100%;
`;

export const ProgressContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  margin: 20px 0;
  max-width: 1000px;
`;

export const CardContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F6F7FB;
  box-shadow: inset 0px 4px 8px 4px rgba(0, 0, 0, 0.05);
`;

export const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 90%;
  max-width: 1000px;
  padding: 20px 0;
`;