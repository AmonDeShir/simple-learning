import { Container } from "../loading.styles";
import { Typography } from "@mui/material";
import { LoadingIcon } from "../../loading-icon/loading-icon";

type Props = {
  message: string;
  noBackground?: boolean;
};

export const Empty = ({ message, noBackground }: Props) => (
  <Container noBackground={noBackground}>
    <LoadingIcon color='#727272' type="empty" />
    <Typography align='center' color="#727272" variant='h4'>
      {message}
    </Typography>
  </Container>
);