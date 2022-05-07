import { Tooltip } from "@mui/material";
import { forwardRef, PropsWithChildren } from "react";
import { StyledCard, StyledCardContent, Header, Title, Icons, Content } from './card.styles';

type Props = PropsWithChildren<{
  title: string;
  margin?: string;
  width?: string;
  size?: 'xs' | 'md' | 'xl';
  icons?: JSX.Element[];
  invert?: boolean,
  fullBorder?: boolean,
  onClick?: () => void
}>;

export const Card = forwardRef<HTMLDivElement, Props>(({
  title,
  margin="none",
  width="90%",
  size="md",
  icons=[],
  invert,
  fullBorder,
  children,
  onClick
}, ref) => (
  <StyledCard 
    width={width} 
    margin={margin} 
    size={size} 
    elevation={5} 
    ref={ref} 
    onClick={onClick}
    {...{ "data-testid": 'card' }}
  >
    <StyledCardContent>
      <Header invert={invert} {...{ "data-testid": 'card-header' }}>
        <Tooltip title={title}>
          <Title variant="h5" align="center" gutterBottom noWrap >
            {title}
          </Title>
        </Tooltip>
        <Icons>
          {icons}
        </Icons>
      </Header>
      <Content fullBorder={fullBorder} invert={invert}>
        {children}
      </Content>
    </StyledCardContent>
  </StyledCard>
));