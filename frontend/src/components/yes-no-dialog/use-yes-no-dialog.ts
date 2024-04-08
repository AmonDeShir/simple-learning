import { useState } from "react";
import { Answer } from "./yes-no-dialog";

export function useYesNoDialog<T = void>(
  onAnswer: (response: Answer, args: T | undefined) => void
): [() => { open: boolean, onAnswer: (answer: Answer) => void }, (args: T) => void] {
  const [open, setOpen] = useState(false);
  const [args, setArgs] = useState<T>();

  const handleAnswer = (answer: Answer) => {
    setOpen(false);
    onAnswer(answer, args);
  }

  return [
    () => ({
      open,
      onAnswer: handleAnswer,
    }),
    (args: T) => {
      setOpen(true);
      setArgs(args);
    }
  ];
}