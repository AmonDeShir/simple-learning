import { WordData } from "../../redux/slices/edit-set/edit-set.type";
import { Card } from "../card/card";
import { SectionTitle, StyledTextField } from "./edit-word.styles";

type Props = {
  data: WordData,
  icons?: JSX.Element[];
  margin?: string;
  onEdit: (data: WordData) => void;
}

export const EditWord = ({
  data,
  icons = [],
  margin,
  onEdit
}: Props) => {
  const { word, meaning, firstExample, secondExample, error } = data;

  type EditKeys = Exclude<keyof WordData, 'firstExample' | 'secondExample'> | "first_example" | "first_translation" | "second_example" | "second_translation";

  const editExample = (data = { example: '', translation: '' }, key: 'example' | 'translation', value: string ) => {
    return { ...data, [key]: value };
  }

  const handleEdit = (value: string, key: EditKeys) => {
    if (key.includes('first') || key.includes('second')) {
      const [ example, exampleKey ] = key.split('_') as [ 'first' | 'second', 'example' | 'translation' ];
      const exampleData = editExample(example === 'first' ? firstExample : secondExample, exampleKey, value) 

      onEdit({ ...data, [`${example}Example`]: exampleData});
      return;
    }

    onEdit({ ...data, [key]: value });
  }


  return (
    <Card title={word} width="100%" size="xl" icons={icons} margin={margin} >
      <SectionTitle align="center" variant="h6">
        Definition
      </SectionTitle>

      <StyledTextField
        type="text"
        label="Word"
        variant="standard"
        color="primary"
        fullWidth
        value={word}
        error={!!error.word}
        helperText={error.word}
        onChange={(e) => handleEdit(e.target.value, 'word')}
        inputProps={{ "data-testid": "word-text-field" }}
      />

      <StyledTextField
        type="text"
        label="Translation"
        variant="standard"
        color="primary"
        fullWidth
        value={meaning}
        error={!!error.meaning}
        helperText={error.meaning}
        onChange={(e) => handleEdit(e.target.value, 'meaning')}
        inputProps={{ "data-testid": "translation-text-field" }}
      />

      <SectionTitle align="center" variant="h6">
        First example
      </SectionTitle>

      <StyledTextField
        type="text"
        label="Example"
        variant="standard"
        color="primary"
        fullWidth
        value={firstExample?.example ?? ''}
        error={!!error.firstExample}
        helperText={error.firstExample}
        onChange={(e) => handleEdit(e.target.value, 'first_example')}
        inputProps={{ "data-testid": "first-example-text-field" }}
      />

      <StyledTextField
        type="text"
        label="Translation"
        variant="standard"
        color="primary"
        fullWidth
        value={firstExample?.translation ?? ''}
        error={!!error.firstExampleTranslation}
        helperText={error.firstExampleTranslation}
        onChange={(e) => handleEdit(e.target.value, 'first_translation')}
        inputProps={{ "data-testid": "first-example-translation-text-field" }}
      />

      <SectionTitle align="center" variant="h6">
        Second example
      </SectionTitle>

      <StyledTextField
        type="text"
        label="Example"
        variant="standard"
        color="primary"
        fullWidth
        value={secondExample?.example ?? ''}
        error={!!error.secondExample}
        helperText={error.secondExample}
        onChange={(e) => handleEdit(e.target.value, 'second_example')}
        inputProps={{ "data-testid": "second-example-text-field" }}
      />

      <StyledTextField
        type="text"
        label="Translation"
        variant="standard"
        color="primary"
        fullWidth
        value={secondExample?.translation ?? ''}
        error={!!error.secondExampleTranslation}
        helperText={error.secondExampleTranslation}
        onChange={(e) => handleEdit(e.target.value, 'second_translation')}
        inputProps={{ "data-testid": "second-example-translation-text-field" }}
      />
    </Card>
  )
};