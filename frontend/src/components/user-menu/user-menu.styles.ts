import { Avatar, Box, styled } from "@mui/material";

export const Container = styled(Box)`
  position: relative;
  width: 70px;
  height: 70px;
  user-select: none;
  border-radius: 25px;
`;

export const StyledAvatar = styled(Avatar)`
  position: absolute;
  z-index: 3;
  right: 10px;
  top: 10px;
  width: 50px;
  height: 50px;
  background-color: #622717;
  box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.5);
  font-weight: bold;
  user-select: none;
  font-size: 20px;
  cursor: pointer;
`;

export const MenuRight = styled(Box)`
  --borderRadius: 25px;
  position: absolute;
  z-index: 2;
  right: 0px;
  height: 100%;
  width: 70px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  border-radius: var(--borderRadius) 25px 25px var(--borderRadius);
  transform: scale(0);

  &::after {
    content: " ";
    top: 0px; 
    position: absolute;
    z-index: -1;
    display: block;
    height: 100%;
    width: 100%;
    border-radius: var(--borderRadius) 25px 25px var(--borderRadius);
    box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25);
  }
`;

export const MenuLeft = styled(Box)`
  position: absolute;
  left: -150px;
  height: 70px;
  width: 150px;
  background-color: ${({ theme }) => theme.palette.common.white};
  border-radius: 25px 0px 0px 25px;
  transform: scale(0);

  &::after {
    content: " ";
    top: 0px; 
    position: absolute;
    z-index: -1;
    display: block;
    height: 100%;
    width: 100%;
    border-radius: 25px 0px 0px 25px;
    box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25);
  }
`;

export const Text = styled('div')`
  height: 100%;
  width: 100%;
  line-height: 70px;
  text-align: center;
  font-weight: bold;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-size: 20px;
  user-select: none;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;