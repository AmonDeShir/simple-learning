import { Typography } from '@mui/material';
import { LoadingIcon } from '../../loading-icon/loading-icon';
import { Container } from '../loading.styles';

type Props = {
  noBackground?: boolean;
}

export const Loader = ({ noBackground }: Props) => (
  <Container noBackground={noBackground}>
    <LoadingIcon color='#727272' type="default" />
    <Typography align='center' color="#727272" variant='h4'>
      Loading please wait...
    </Typography>
  </Container>
);