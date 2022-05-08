import { capitalize } from "@mui/material";
import { useRef, useState } from "react";
import { hideAnimation, showAnimation } from "./user-menu.animations";
import { Container, MenuLeft, MenuRight, StyledAvatar, Text } from "./user-menu.styles";

type Props = {
  user: string;
  item: string;
  onItemClick?: () => void;
}

export const UserMenu = ({ user, item, onItemClick }: Props ) => {
  const name = user.split(' ').map(capitalize).map(part => part[0]).join('');
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [isAnimationPlaying, setIsAnimationPlaying] = useState<boolean>(false);
 
  const menuLeft = useRef<HTMLDivElement>(null);
  const menuRight = useRef<HTMLDivElement>(null);
  const avatar = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    const refs = {
      left: menuLeft.current,
      right: menuRight.current,
      avatar: avatar.current,
    }

    if (!isAnimationPlaying) {
      setIsAnimationPlaying(true);

      if (!showMenu) {
        showAnimation(refs, () => setIsAnimationPlaying(false));
      }
      else {
        hideAnimation(refs, () => setIsAnimationPlaying(false));
      }

      setShowMenu((prevState) => !prevState);
    }
  }
  
  return (
    <Container>
      <StyledAvatar ref={avatar} onClick={toggleMenu} alt={user}>{name}</StyledAvatar>
      <MenuRight ref={menuRight} />
      <MenuLeft ref={menuLeft} onClick={onItemClick}>
        <Text>{item}</Text>
      </MenuLeft>
    </Container>
  );
};