import { useState } from "react"
import { EditWord } from "../../../../components/edit-word/edit-word"
import { generateUsedInText, UsedInInfoIcon } from "../../../../components/used-in-info-icon/used-in-info-icon"
import { useYesNoDialog } from "../../../../components/yes-no-dialog/use-yes-no-dialog"
import { YesNoDialog } from "../../../../components/yes-no-dialog/yes-no-dialog"
import { WordData, WordDataConstructor } from "../../../../redux/slices/edit-set/edit-set.type"
import { StyledTypography } from "../edit-set/edit-set.styles"
import { Container } from "./new-word.styles"

type Props = {
  data: WordDataConstructor
  onEdit: (data: WordDataConstructor) => void;
}

export const CreateDefinition = ({ data, onEdit }: Props) => {
  const [ dialogMessage, setDialogMessage ] = useState('');
  const [ registerDialog, openDialog ] = useYesNoDialog<WordData>(
    (res, word) => {
      if (word && res === 'yes') {
        onEdit({...word, type: 'edit'});   
      }

      if (word && res === 'no') {
        onEdit({...word, type: 'create', usedIn: []});   
      }
    }
  )

  const handleEdit = (word: WordData) => {
    const isUsedInOtherSets = word.type === 'import' && word.usedIn && word.usedIn.length > 0;

    if (isUsedInOtherSets) {
      setDialogMessage(`${generateUsedInText(word.usedIn)}. Do you want to update other definitions?`);
      openDialog(word);
    }
    else if (word.type === 'import') {
      onEdit({...word, type: 'edit'});
    }
    else {
      onEdit(word); 
    }
  }

  return (
    <Container paddingBottom={0}>
      <StyledTypography align="center" variant="h6" fontWeight="normal">
        Define your definition using the text boxes below (the example fields are optional)
      </StyledTypography>

      <EditWord
        data={data as WordData}
        onEdit={handleEdit}
        icons={[<UsedInInfoIcon key="0" usedIn={data.usedIn} />]}
      />

      <YesNoDialog
        message={dialogMessage}
        {...registerDialog()}
      />
    </Container>
  )
}