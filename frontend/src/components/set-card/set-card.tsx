import { Box, Grid, Typography } from "@mui/material";
import { SuperMemoPhase } from "../../super-memo/super-memo.types";
import { Card } from "../card/card";

type Props = {
  title: string;
  margin?: string;
  limit?: number;
  small?: boolean;
  icons?: JSX.Element[];
  onClick?: () => void;
  progress?: { [key in SuperMemoPhase]: number };
  data?: {
    id: string,
    word: string,
    meaning: string,
  }[];
}

export const SetCard = ({
  title,
  margin = '0 0 20px 0',
  small = false,
  limit,
  data = [],
  progress = { graduated: 0, learning: 0, relearning: 0 },
  icons = [],
  onClick
}: Props) => (
  <Card width="100%" title={title} size='md' margin={margin} onClick={onClick} icons={icons}>
    <Grid container>
      {!small && 
        <Grid item xs={4}>
          {data.slice(0, limit ?? data.length).map(({ id, word }) => (
            <Typography key={id} noWrap variant="body1" style={{ fontWeight: 'bold' }}>{word}</Typography>
          ))}
        </Grid>
      }

      <Grid item xs={small ? 12 : 4}>
        <Box 
          display="flex" 
          width="100%"
          height="100%" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems={small ? "center" : "none"}
        >
          <Typography align="center" variant="body1">Learning: {progress.learning}</Typography>
          <Typography align="center" variant="body1">Relearning: {progress.relearning}</Typography>
          <Typography align="center" variant="body1">Graduated: {progress.graduated}</Typography>
        </Box>
      </Grid>

      {!small && 
        <Grid item xs={4}>
          {data.slice(0, limit).map(({ id, meaning }) => (
            <Typography key={id} noWrap align="right"  variant="body1" style={{ fontWeight: 'bold' }}>{meaning}</Typography>
          ))}
        </Grid>
      }
    </Grid>
  </Card>
);