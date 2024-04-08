import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Container = styled(Box)`
  position: relative;
`;

export const Text = styled('div')`
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5;
  letter-spacing: 0.00938em;
  padding: 0;
  margin: 0;
  text-align: center;
`;

type IconProps = {
  container: { width: number, height: number };
  multiline?: boolean;
}

export const Icon = styled(Box)<IconProps>`
  position: absolute;
  bottom: ${({ container }) => container.height - 10}px;
  left: ${({ multiline, container }) => multiline ? container.width - 18 : container.width - 10}px;
`;