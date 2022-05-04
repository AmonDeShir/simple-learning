import { useMemo } from "react";
import { AddMark, NoneMark, RemoveMark, ReplaceMark } from "./compare-texts.styles";

type Props = {
  text: string;
  goal: string;
}

export const  CompareTexts = ({ text, goal }: Props) => {
  const value = useMemo(() => {
    const result: JSX.Element[] = [];

    for (let i = 0; i < Math.max(goal.length, text.length); i++) {
      if (!text[i]) {
        result.push(<AddMark key={`add-${i}`}>{goal[i]}</AddMark>);
        continue;
      }
  
      if (!goal[i]) {
        result.push(<RemoveMark key={`remove-${i}`}>{text[i]}</RemoveMark>);
        continue;
      }
      
      if (text[i] !== goal[i]) {
        result.push(<ReplaceMark key={`replace-${i}`}>{goal[i]}</ReplaceMark>);
        continue;
      }

      result.push(<NoneMark key={`none-${i}`}>{goal[i]}</NoneMark>);
    }

    return result;
  }, [goal, text])

  return <> { value } </>
}