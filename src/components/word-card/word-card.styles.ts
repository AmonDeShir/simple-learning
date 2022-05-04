import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const ExampleContainer = styled(Grid)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

export const Example = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 15px 0;
  height: 50%;
`;

export const Translation = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

export const StyledTypography = styled(Typography)`
  font-weight: bold;
  max-width: 200px;
`;