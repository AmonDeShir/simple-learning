import { PropsWithChildren, useRef } from "react";
import { Container, Text, Icon } from "./text-with-icon.styles";
import { useRect } from '../../utils/use-rect/use-rect';

type Props = PropsWithChildren<{
  icon: JSX.Element,
}>;

export const TextWithIcon = ({ children, icon }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRect(ref);

  return (
    <Container>
      <Text ref={ref}>{children}</Text>
      <Icon container={rect} multiline={rect.height > 24}>{icon}</Icon>
    </Container>
  );
}