import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Popover = styled(Paper)`
  position: absolute;
  z-index: 1;
  max-width: 450px;
  width: 60vw;
  padding: 25px;
  bottom: 40px;
  right: 35px;
`;