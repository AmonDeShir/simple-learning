import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AnimatedIcon } from "../../../../components/animated-icon/animated-icon";
import { EditWord } from "../../../../components/edit-word/edit-word";
import { Header } from "../../../../components/header/header";
import { Button, TextField } from "../../../../components/styles/styles";
import { useYesNoDialog } from '../../../../components/yes-no-dialog/use-yes-no-dialog';
import { YesNoDialog } from '../../../../components/yes-no-dialog/yes-no-dialog';
import { clear, createSet, editWord, removeWord, setTitle } from '../../../../redux/slices/edit-set/edit-set';
import { WordData } from '../../../../redux/slices/edit-set/edit-set.type';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';
import { CenterPage, StyledTypography, Container, TextWithButton, SaveCancelContainer } from './edit-set.styles';
import { Loading } from '../../../../components/loading/loading';
import { generateUsedInText, UsedInInfoIcon } from '../../../../components/used-in-info-icon/used-in-info-icon';

export const EditSet = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isProtected, title, words, progress } = useAppSelector(({ editSet }) => editSet);
  const [ hasError, setHasError ] = useState(false);

  useEffect(() => {
    if (progress.mode === 'saving' && progress.state === 'success') {
      dispatch(clear());
      navigate('/set-list')
    }
    
  }, [dispatch, navigate, progress]);

  useEffect(() => {
    setHasError(!words.every(({ error }) => Object.keys(error).length === 0))
  }, [words]);

  useEffect(() => {
    if (progress.mode === 'loading' && progress.state === 'success') {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [progress])

  const handleSave = () => {
    dispatch(createSet());
  }

  const handleCancel = () => {
    dispatch(clear());
    navigate('/set-list')
  }

  const [ editDialogMessage, setEditDialogMessage ] = useState('');
  const [ registerEditDialog, openEditDialog ] = useYesNoDialog<WordData>(
    (res, word) => {
      if (word && res === 'yes') {
        dispatch(editWord({...word, type: 'edit'}));   
      }

      if (word && res === 'no') {
        dispatch(editWord({...word, type: 'create', usedIn: []}));   
      }
    }
  )

  const [ deleteDialogWord, setDeleteDialogWord ] = useState('');
  const [ registerDeleteDialog, openDeleteDialog ] = useYesNoDialog<WordData>((answer, word) => {
    if (word && answer === 'yes') {
      dispatch(removeWord(word?.id));
    }
  });

  const handleEditWord = (word: WordData) => {
    const isUsedInOtherSets = word.type === 'import' && word.usedIn && word.usedIn.length > 0;

    if (isUsedInOtherSets) {
      setEditDialogMessage(`${generateUsedInText(word.usedIn)}. Do you want to update other definitions?`);
      openEditDialog(word);
      
      return;
    }

    if (word.type === 'import') {
      dispatch(editWord({...word, type: 'edit'}));
    }
    else {
      dispatch(editWord(word)); 
    }
  }

  return (
    <CenterPage>
      <Header title={title} />
      <Container>
        <Loading timeout={10000} noBackground {...progress}>
          
          { !isProtected && (
            <>
              <StyledTypography align="center" variant="h6">
                Edit set's title
              </StyledTypography>

              <TextField
                  style={{ width: '100%' }}
                  type="text"
                  label="Set title"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  value={title}
                  onChange={(e) => dispatch(setTitle(e.target.value))}
              />
            </>
          )}
          
          { words.map((word) => (
            <EditWord 
              key={word.id}
              data={word}
              onEdit={handleEditWord}
              margin="20px 0 0 0"
              icons={[
                <UsedInInfoIcon key="0" usedIn={word.usedIn} />,
                <AnimatedIcon key="1" size={25} Icon={DeleteIcon} onClick={() => { setDeleteDialogWord(word.word); openDeleteDialog(word)}} />
              ]}
            />
          ))}

          <TextWithButton>
            <Typography align="center" variant="h6" padding="0 10px">
              click the button on the left to create&nbsp;a
            </Typography>

            <Button
              type="submit"
              color="primary"
              variant="contained"
              onClick={() => navigate('/new-word')}
            >
              New Word
            </Button>
          </TextWithButton>

          <SaveCancelContainer>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              onClick={handleSave}
              disabled={hasError}
            >Save</Button>

            <Button
              type="submit"
              color="primary"
              variant="contained"
              onClick={handleCancel}
            >Cancel</Button>
          </SaveCancelContainer>
          
          <YesNoDialog
            message={editDialogMessage}
            {...registerEditDialog()}
          />

          <YesNoDialog
            message={`Are you sure you want to delete “${deleteDialogWord}” word?`}
            {...registerDeleteDialog()}
          />
        </Loading>
      </Container>
    </CenterPage>
  );
}