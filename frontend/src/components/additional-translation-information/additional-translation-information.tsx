import { Slide, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { AnimatedIcon } from "../animated-icon/animated-icon";
import { useState } from "react";
import InfoIcon from '@mui/icons-material/Info';
import { Popover } from "./additional-translation-information.styles";

type Props = {
  info: {
    addition: string,
    partOfSpeech: string,
    lang: {
      en: string, 
      ru: string, 
      be: string, 
      uk: string, 
      pl: string, 
      cs: string, 
      sk: string, 
      bg: string, 
      mk: string, 
      sr: string, 
      hr: string, 
      sl: string,
    }
  },
}

export const AdditionalTranslationInformationIcon = ({ info }: Props) => {
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
        <Popover elevation={10} onDoubleClick={() => setShowInfo(false)}>
          <LanguageTable info={info} />
        </Popover>
      </Slide>
    </div>
  );
}

export const LanguageTable = ({ info }: Props) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Language</TableCell>
            <TableCell align="center">Translation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="center" component="th" scope="row">English</TableCell>
            <TableCell align="center" component="th" scope="row">{info.lang.en}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" component="th" scope="row">Russian</TableCell>
            <TableCell align="center" component="th" scope="row">{info.lang.ru}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" component="th" scope="row">Belarusian</TableCell>
            <TableCell align="center" component="th" scope="row">{info.lang.be}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" component="th" scope="row">Ukrainian</TableCell>
            <TableCell align="center" component="th" scope="row">{info.lang.uk}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" component="th" scope="row">Polish</TableCell>
            <TableCell align="center" component="th" scope="row">{info.lang.pl}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" component="th" scope="row">Czech</TableCell>
            <TableCell align="center" component="th" scope="row">{info.lang.cs}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" component="th" scope="row">Slovak</TableCell>
            <TableCell align="center" component="th" scope="row">{info.lang.sk}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" component="th" scope="row">Slovene</TableCell>
            <TableCell align="center" component="th" scope="row">{info.lang.sl}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" component="th" scope="row">Croatian</TableCell>
            <TableCell align="center" component="th" scope="row">{info.lang.hr}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" component="th" scope="row">Serbian</TableCell>
            <TableCell align="center" component="th" scope="row">{info.lang.sr}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" component="th" scope="row">Macedonian</TableCell>
            <TableCell align="center" component="th" scope="row">{info.lang.mk}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" component="th" scope="row">Bulgarian</TableCell>
            <TableCell align="center" component="th" scope="row">{info.lang.bg}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}