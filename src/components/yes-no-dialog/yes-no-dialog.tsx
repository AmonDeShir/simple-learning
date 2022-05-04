import CloseIcon from '@mui/icons-material/Close';
import { DialogActions, DialogContent, DialogTitle, DialogTitleProps, Typography } from "@mui/material";
import { AnimatedIcon } from "../animated-icon/animated-icon";
import { Button } from '../styles/styles';
import { StyledDialog } from "./yes-no-dialog.styles"

type TitleProps = DialogTitleProps & {
  onClose?: () => void;
}

const Title = (props: TitleProps) => {
  const {  onClose, ...other } = props;

  return (
    <DialogTitle {...other}>
      <AnimatedIcon
        Icon={CloseIcon}
        onClick={onClose}
        size={25}
      />
    </DialogTitle>
  );
};

export type Answer = 'yes' | 'no' | 'close';

type YesNoDialogProps = {
  message: string;
  open: boolean;
  onAnswer: (answer: Answer) => void;
}

export const YesNoDialog = ({
  message,
  open,
  onAnswer
}: YesNoDialogProps) => (
  <StyledDialog
    keepMounted={false}
    open={open}
  >
    <Title 
      onClose={() => onAnswer('close')} 
    />
    <DialogContent dividers>
      <Typography align="center" gutterBottom>
        {message}
      </Typography>
    </DialogContent>

    <DialogActions>
      <Button variant='contained' autoFocus onClick={() => onAnswer('yes')}>
        Yes
      </Button>
      <Button variant='contained' autoFocus onClick={() => onAnswer('no')}>
        No
      </Button>
    </DialogActions>
  </StyledDialog>
);