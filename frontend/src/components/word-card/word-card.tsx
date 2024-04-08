import { Grid } from "@mui/material";
import { TextWithBrackets } from "../text-with-brackets/text-with-brackets";
import { Card } from "../card/card";
import { AudioIcon } from "../audio-icon/audio-icon";
import { TextWithIcon } from "../text-with-icon/text-with-icon";
import { Example, ExampleContainer, StyledTypography, Translation } from "./word-card.styles";

export type WordData = {
  word: string;
  meaning: string;
  audio?: string;

  firstExample?: {
    example: string;
    translation: string;
    audio?: string;
  },

  secondExample?: {
    example: string;
    translation: string;
    audio?: string;
  }
}

type Props = {
  margin?: string;
  icons?: JSX.Element[];
  onClick?: () => void;
  data: WordData & { id?: string };
}

export const WordCard = ({
  margin = '0 0 20px 0',
  data,
  icons = [],
  onClick
}: Props) => {
  const hasExamples = !!data.firstExample || !!data.secondExample

  return (
    <Card
      title={data?.word} 
      width="100%" 
      size='md' 
      margin={margin} 
      onClick={onClick} 
      icons={[
        ...icons,
        ...(data.audio ? [<AudioIcon key="-1" color="white" src={data.audio} />] : []),
      ]}
    >
      <Grid container>
        <Grid item xs={hasExamples ? 6 : 12}>
          <Translation>
            <StyledTypography variant="h6" align="center">
              {data.meaning}
            </StyledTypography>
          </Translation>
        </Grid>

        {(data.firstExample || data.secondExample) && (
          <ExampleContainer item xs={6}>
            {data.firstExample && (
              <Example>
                <TextWithIcon icon={ data.firstExample.audio ? <AudioIcon size={20} src={data.firstExample.audio} /> : <></>}>
                  {data.firstExample.example}
                </TextWithIcon>

                <TextWithBrackets>
                  {data.firstExample.translation}
                </TextWithBrackets>
              </Example>
            )}

            {data.secondExample && (
              <Example>
                <TextWithIcon icon={ data.secondExample.audio ? <AudioIcon size={20} src={data.secondExample.audio} /> : <></>}>
                  {data.secondExample.example}
                </TextWithIcon>
                  
                <TextWithBrackets>
                  {data.secondExample.translation}
                </TextWithBrackets>
              </Example>
            )}
          </ExampleContainer>
        )}
      </Grid>
    </Card>
  )
};