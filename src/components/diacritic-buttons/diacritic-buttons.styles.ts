import { styled } from "@mui/material";

export const Container = styled('div')`
  position: absolute;
  bottom: -55px;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  align-items: top;
  width: 100%;
  height: 50px;
`;

export const Letter = styled('div')`
  border-radius: 5px;
  font-size: 15px;
  line-height: 20px;
  background-color: ${({ theme }) => theme.palette.primary.main };
  color: ${({ theme }) => theme.palette.secondary.contrastText };
  font-family: 'Roboto';
  text-align: center;
  width: 20px;
  height: 20px;
  transition: background-color, 0.25s;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: ${({ theme }) => theme.palette.primary.dark };
  }
`;