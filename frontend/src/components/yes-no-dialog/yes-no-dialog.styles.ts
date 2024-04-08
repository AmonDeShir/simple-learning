import { Dialog, styled } from "@mui/material";

export const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    background-color: ${({ theme }) => theme.palette.primary.main};
  }

  & .MuiDialogTitle-root {
    background-color: ${({ theme }) => theme.palette.primary.main};
    width: 100%;
    padding: 5px 10px;
    display: flex;
    justify-content: flex-end;
  }

  & .MuiDialogContent-root {
    padding: ${({ theme }) => theme.spacing(2)};
    padding-bottom: 0;
    background-color: ${({ theme }) => theme.palette.background.paper};
    border-bottom: none;
  }

  & .MuiDialogActions-root {
    padding: ${({ theme }) => theme.spacing(2)};
    background-color: ${({ theme }) => theme.palette.background.paper};
    display: flex;
    justify-content: space-around;
  }
`;