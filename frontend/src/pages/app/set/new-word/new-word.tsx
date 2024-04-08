import { Typography } from "@mui/material"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Header } from "../../../../components/header/header"
import { Button } from "../../../../components/styles/styles"
import { addWord } from "../../../../redux/slices/edit-set/edit-set"
import { AvailableLangauges, Language, requiredFields, WordDataConstructor } from "../../../../redux/slices/edit-set/edit-set.type"
import { useAppDispatch } from "../../../../redux/store"
import { CenterPage, SaveCancelContainer, TextWithButton } from "../edit-set/edit-set.styles"
import { CreateDefinition } from "./create-definition"
import { Container } from "./new-word.styles"
import { SelectDefinition } from "./select-definition"

export const NewWord = () => {
  const params = useParams();
  const [ selectMode, setSelectMode ] = useState(false);
  const [ hasError, setHasError ] = useState(false);

  const language = AvailableLangauges.includes(params.lang ?? "") ? params.lang as Language : "English";

  const [ data, setData ] = useState<WordDataConstructor>({
    word: 'New Word',
    meaning: 'Translation',
    type: 'create',
    error: {},
    language,
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSelect = (data: WordDataConstructor) => {
    setSelectMode(false);
    setData(validate(data));
  }

  const saveWord = () => {
    dispatch(addWord(validate(data)));
    navigate('/edit-set');
  }
  
  const validate = (data: WordDataConstructor) => {
    data.error = {};

    for(const filed of requiredFields) {
      if (data[filed].length === 0) {
        data.error[filed] = 'This filed is required.'
      }
    }

    setHasError(Object.keys(data.error).length > 0);

    return data;
  }

  return (
    <CenterPage>
      <Header title="New word" />
      
      { 
        selectMode 
          ? <SelectDefinition word={data.word} onSelect={handleSelect} /> 
          : <CreateDefinition data={data} onEdit={(data) => setData(validate(data))} /> 
      }

      <Container paddingTop={0}>
        <TextWithButton>
          <Typography align="center" variant="h6" padding="0 10px">
            { selectMode ? 'or just add your own\xa0custom' : 'or just select a definition\xa0from\xa0the' }
          </Typography>

          <Button
            type="submit"
            color="primary"
            variant="contained"
            onClick={() => setSelectMode((mode) => !mode)}
          >
            { selectMode ? 'Definition' : 'Dictionary' }
          </Button>
        </TextWithButton>

        <SaveCancelContainer>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            onClick={saveWord}
            disabled={hasError}
          >Save</Button>

          <Button
            type="submit"
            color="primary"
            variant="contained"
            onClick={() => navigate('/edit-set')}
          >Cancel</Button>
        </SaveCancelContainer>
      </Container>
    </CenterPage>
  )
}