import { useMemo } from "react";
import { Language } from "../../redux/slices/edit-set/edit-set.type";
import { Container, Letter } from "./diacritic-buttons.styles";

export const lettersPerLanguage = {
  "Polish": ["ą", "ę", "ż", "ź", "ó", "ł"],
  "Interslavic": ["č", "ž", "ě", "š"],
  "Czech": ["á", "č", "ď", "é", "ě", "í", "ň", "ó", "ř", "š", "ť", "ú", "ů", "ý", "ž"],
  "English": []
}

export type Props = {
  languages: (Language | "Czech")[] ,
  onClick: (letter: string) => void;
}

export const DiacriticButtons = ({ onClick, languages }: Props) => {
  const letters = useMemo(() => {
    return languages.reduce<string[]>((prev, lang) => [
      ...prev, ...lettersPerLanguage[lang].filter(letter => !prev.includes(letter))
    ], []).sort();
  }, [languages]);

  return (
    <Container>
      {letters.map((letter) =>
        <Letter key={letter} onClick={() => onClick(letter)}>{letter}</Letter>
      )}
    </Container>
  )
}