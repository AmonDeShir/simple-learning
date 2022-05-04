import { PropsWithChildren, useRef } from "react";
import { useRect } from '../../utils/use-rect/use-rect';
import { Bracket } from "./bracket";
import { Container, Text } from './text-with-brackets.styles';

type Props = PropsWithChildren<{
  bracketsScale?: number;
}>;

export const TextWithBrackets = ({ 
  children,
  bracketsScale = 1.2
}: Props) => {
  const ref = useRef<HTMLElement>(null);
  const rect = useRect(ref);

  return (
    <Container> 
      <Bracket height={rect.height * bracketsScale} />
      <Text ref={ref}>
        {children}
      </Text>
      <Bracket height={rect.height * bracketsScale} side="right"  />
    </Container>
  );
}