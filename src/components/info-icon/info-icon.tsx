import { Slide } from "@mui/material";
import { AnimatedIcon } from "../animated-icon/animated-icon";
import InfoIcon from '@mui/icons-material/Info';
import { useState } from "react";
import { Popover } from "./info-icon.styles";

type Props = {
  text: string;
}

export const IconInfo = ({ text }: Props) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const handleClick = () => {
    setShowInfo((showInfo) => !showInfo);
  };

  return (
    <div style={{ width: 25, height: 25 }} >
      <AnimatedIcon
        size={25} 
        Icon={InfoIcon} 
        onClick={handleClick}
      />
      <Slide direction="left" in={showInfo} mountOnEnter unmountOnExit>
        <Popover elevation={10} onClick={() => setShowInfo(false)}>
          {text}
        </Popover>
      </Slide>
    </div>
  );
}