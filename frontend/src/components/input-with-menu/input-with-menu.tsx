import Menu from "@mui/icons-material/Menu";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { AnimatedIcon } from "../animated-icon/animated-icon";
import { Container, IconContainer, StyledCollapse } from "./input-with-menu.styles";

type Props = PropsWithChildren<{
  width?: string,
  maxwidth?: string,
  minwidth?: string,
  color?: 'black' | 'white' | 'primary' | 'secondary',
  menu?: JSX.Element,
}>;

export const InputWithMenu = ({ 
  width = "none",
  maxwidth = "none",
  minwidth = "none",
  color = "primary",
  menu = <></>,
  children 
}: Props) => {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let preventClose = false;

    function preventNoIntendedClosing(e: MouseEvent) {
      preventClose = true;
    }

    function hideMenu() {
      if (show && !preventClose) {
        setShow(false);
      }

      preventClose = false;
    }
    
    ref.current?.addEventListener('click', preventNoIntendedClosing);
    document.addEventListener('click', hideMenu);

    return () => {
      ref.current?.removeEventListener('click', preventNoIntendedClosing);
      document.removeEventListener('click', hideMenu);
    };
  }, [ref.current, setShow, show]);

  return (
    <Container width={width} minwidth={minwidth} maxwidth={maxwidth} ref={ref} >
      <IconContainer>
        <AnimatedIcon 
          color={color}
          size={22}  
          Icon={Menu} 
          onClick={() => setShow((state) => !state)}
        />
      </IconContainer>
      {children}
      <StyledCollapse in={show} unmountOnExit mountOnEnter>{menu}</StyledCollapse>
    </Container>
  );
}