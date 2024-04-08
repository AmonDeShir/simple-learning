import { Box, Typography } from "@mui/material";
import { Card } from "../card/card";
import { Progress } from "../progress/progress";

type SectionProps = {
  title: string;
  items: { title: string, value: string, id: string }[],
}

const Section = ({ title, items }: SectionProps) => (
  <>
    <Typography fontWeight="normal" marginBottom="10px" variant="h5" width="100%" align="center">
      { title }
    </Typography>

    {items.map(({id, title, value}) => (
      <Box key={id} display="flex" marginBottom="20px" justifyContent="space-between" alignItems="center">
        <Typography fontSize="1rem" align="left" fontWeight="bold" >
          {title}
        </Typography>
        <Typography fontSize="1rem" align="right">
          {value}
        </Typography>
      </Box>
    ))}
  </>
);

type Props = {
  corrects: { title: string, value: string, id: string }[],
  wrongs: { title: string, value: string, id: string }[],
  all: number,
  onClick?: () => void,
}

const asPercent = (value: number, all: number) => {
  return Math.floor(Math.max(all, 0) ? (100 * value) / all : 100)
}

export const GameStatisticsCard = ({ all, corrects, wrongs, onClick }: Props) => (
  <Box padding="20px 10px" width="90vw" display="flex" justifyContent="center">
    <Card title="Done" fullBorder width="100%" size="md" onClick={onClick}>
      <Box display="flex" alignItems="center">
        <Typography fontWeight="bold" width="50px" align="center">
          {asPercent(corrects.length, all)}%
        </Typography>

        <Progress 
          value={corrects.length}
          max={all} 
          format="fraction" 
          textPosition="center-after" 
          text="without mistake"
        />
      </Box>
      {corrects.length > 0 && <Section title="Corrects" items={corrects} />}
      {wrongs.length > 0 && <Section title="Wrongs" items={wrongs} />}
    </Card>
  </Box>
)