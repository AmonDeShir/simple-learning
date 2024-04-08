import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StandardTextField } from '../styles/styles';

export const SectionTitle = styled(Typography)`
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: -10px;
`;

export const StyledTextField = styled(StandardTextField)`
  width: 100%;
  margin: 10px 0;
`;