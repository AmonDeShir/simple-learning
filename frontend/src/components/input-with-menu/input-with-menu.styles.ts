import { Collapse } from "@mui/material";
import { styled } from "@mui/material/styles";

type Props = {
  width?: string,
  maxwidth?: string,
  minwidth?: string,
};

export const Container = styled('div')<Props>`
  position: relative;
  width: ${({ width }) => width};
  max-width: ${({ minwidth }) => minwidth};
  min-width: ${({ maxwidth }) => maxwidth};
`;

export const IconContainer = styled("div")`
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 2;
`;

export const StyledCollapse = styled(Collapse)`
  left: 12.5px;
  right: 12.5px;
  position: absolute;
  z-index: 3;
  background: ${({ theme }) => theme.palette.background.paper};
  box-shadow: rgb(0 0 0 / 20%) 0px 2px 4px -1px, rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px;
  border-radius: 0px 0px 20px 20px;
`;