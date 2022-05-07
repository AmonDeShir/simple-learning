import { Box, Tooltip, Typography } from "@mui/material";
import { LearnItem } from "../../redux/slices/learn/learn.types";
import { Card } from "../card/card";

type AnswerProps = {
  answer: { item: string, values: number[], nextRepetition: number },
  items: LearnItem[];
}

const Answer = ({ answer, items }: AnswerProps) => {
  const item = items.find(i => i.id === answer.item);
  const answers = answer.values.map(v => `${Math.round(v * 100)}%`).join(', ');
  const nextRepetition = new Date(answer.nextRepetition).toLocaleDateString("en-us", { day: '2-digit', month: '2-digit', year: 'numeric' });

  if (!item) {
    return <></>;
  }

  return (
    <Box marginBottom="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Tooltip title="Text">
          <Typography fontSize="1rem" align="left" fontWeight="bold" >
            {item.text}
          </Typography>
        </Tooltip>

        <Tooltip title="Translation">
          <Typography fontSize="1rem" align="right">
            {item.translation}
          </Typography>
        </Tooltip>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Tooltip title="Next repetition">
          <Typography fontSize="1rem" align="left">
            {nextRepetition}
          </Typography>
        </Tooltip>

        <Tooltip title="Answers">
          <Typography fontSize="1rem" align="right">
            {answers}
          </Typography>
        </Tooltip>
      </Box>
    </Box>
  );
};

type Props = {
  items: LearnItem[];
  answers: { item: string, values: number[], nextRepetition: number }[],
  onClick?: () => void,
}


export const LearnStatisticsCard = ({ items, answers, onClick }: Props) => (
  <Box padding="20px 10px" width="90vw" display="flex" justifyContent="center">
    <Card title="Done" fullBorder width="100%" size="md" onClick={onClick}>
      {answers.map((answer) => (
        <Answer key={answer.item} answer={answer} items={items} />
      ))}
    </Card>
  </Box>
)