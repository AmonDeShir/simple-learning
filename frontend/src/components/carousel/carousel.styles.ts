import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

type Props = { 
  height?: string;
};

export const Container = styled(Box)<Props>`
  display: flex;
  width: 100%;
  background-color: #F6F7FB;
  box-shadow: inset 0px 4px 8px 4px rgba(0, 0, 0, 0.05);
  ${({ height }) => height && `height: ${height};` };

  & .MuiIconButton-root {
    background: rgba(0, 0, 0, 0);
    color: ${({ theme }) => theme.palette.primary.main};
    filter: none;
    opacity: 1 !important;

    &:hover {
      background: rgba(0, 0, 0, 0);
      filter: none;
      opacity: 1 !important;
    }
  }
`;

export const ButtonContainer = styled(Box)<Props>`
  width: 50 24px;
  padding: 93px 13px;
  color: ${({ theme }) => theme.palette.primary.main};
  transition: transform 0.25s;
  transform: scale(1);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  &:hover {
    transform: scale(1.25);
    cursor: pointer;
  }

  &:active {
    transform: scale(2);
  }
`;