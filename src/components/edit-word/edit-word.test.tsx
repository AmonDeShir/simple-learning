import { fireEvent, render, screen } from "@testing-library/react";
import { EditWord } from "./edit-word";

const data = {
  word: {
    type: 'create' as 'create',
    id: '',
    word: 'test',
    meaning: 'test meaning',
    firstExample: {
      example: 'example 1',
      translation: 'translation 1',
    },
    secondExample: {
      example: 'example 2',
      translation: 'translation 2',
    },
    error: {},
  },

  withoutExamples: {
    type: 'create' as 'create',
    id: '',
    word: 'test',
    meaning: 'test meaning',
    error: {},
  }
};

describe(`EditWord`, () => {
  it(`should display the word's data in input fields`, () => {
    render(<EditWord onEdit={()=>{}} data={data.word} />);

    expect(screen.getByTestId('word-text-field')).toHaveValue(data.word.word);
    expect(screen.getByTestId('translation-text-field')).toHaveValue(data.word.meaning);
    expect(screen.getByTestId('first-example-text-field')).toHaveValue(data.word.firstExample.example);
    expect(screen.getByTestId('first-example-translation-text-field')).toHaveValue(data.word.firstExample.translation);
    expect(screen.getByTestId('second-example-text-field')).toHaveValue(data.word.secondExample.example);
    expect(screen.getByTestId('second-example-translation-text-field')).toHaveValue(data.word.secondExample.translation);
  });

  it(`should keep the example's text fields empty if the word doesn't have examples`, () => {
    render(<EditWord onEdit={()=>{}} data={data.withoutExamples} />);

    expect(screen.getByTestId('word-text-field')).toHaveValue(data.word.word);
    expect(screen.getByTestId('translation-text-field')).toHaveValue(data.word.meaning);
    expect(screen.getByTestId('first-example-text-field')).toHaveValue('');
    expect(screen.getByTestId('first-example-translation-text-field')).toHaveValue('');
    expect(screen.getByTestId('second-example-text-field')).toHaveValue('');
    expect(screen.getByTestId('second-example-translation-text-field')).toHaveValue('');
  });

  it(`should render icons from the icons property`, () => {
    const icons = [
      <div key="1" data-testid="icon-1" />,
      <div key="2" data-testid="icon-2" />,
    ];

    render(<EditWord onEdit={()=>{}} data={data.word} icons={icons} />);

    expect(screen.getByTestId('icon-1')).toBeInTheDocument();
    expect(screen.getByTestId('icon-2')).toBeInTheDocument();
  })

  it(`should call the property's onEdit function if the word's data is changed`, () => {
    const onEdit = jest.fn();

    render(<EditWord data={data.word} onEdit={onEdit} />);

    const word = screen.getByTestId('word-text-field');
    const meaning = screen.getByTestId('translation-text-field');
    const firstExample = screen.getByTestId('first-example-text-field');
    const firstExampleTranslation = screen.getByTestId('first-example-translation-text-field');
    const secondExample = screen.getByTestId('second-example-text-field');
    const secondExampleTranslation = screen.getByTestId('second-example-translation-text-field');

    fireEvent.change(word, { target: { value: 'new value' }});
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith({
      ...data.word,
      word: 'new value',
    });

    fireEvent.change(meaning, { target: { value: 'new value' }});
    expect(onEdit).toHaveBeenCalledTimes(2);
    expect(onEdit).toHaveBeenCalledWith({
      ...data.word,
      meaning: 'new value',
    });

    fireEvent.change(firstExample, { target: { value: 'new value' }});
    expect(onEdit).toHaveBeenCalledTimes(3);
    expect(onEdit).toHaveBeenCalledWith({
      ...data.word,
      firstExample: {
        example: 'new value',
        translation: data.word.firstExample.translation,
      },
    });

    fireEvent.change(firstExampleTranslation, { target: { value: 'new value' }});
    expect(onEdit).toHaveBeenCalledTimes(4);
    expect(onEdit).toHaveBeenCalledWith({
      ...data.word,
      firstExample: {
        example: data.word.firstExample.example,
        translation: 'new value',
      },
    });

    fireEvent.change(secondExample, { target: { value: 'new value' }});
    expect(onEdit).toHaveBeenCalledTimes(5);
    expect(onEdit).toHaveBeenCalledWith({
      ...data.word,
      secondExample: {
        example: 'new value',
        translation: data.word.secondExample.translation,
      },
    });

    fireEvent.change(secondExampleTranslation, { target: { value: 'new value' }});
    expect(onEdit).toHaveBeenCalledTimes(6);
    expect(onEdit).toHaveBeenCalledWith({
      ...data.word,
      secondExample: {
        example: data.word.secondExample.example,
        translation: 'new value',
      },
    });
  });

  it(`should display error messages from the error property`, () => {
    const error = {
      word: 'error message 1',
      meaning: 'error message 2',
      firstExample: 'error message 3',
      firstExampleTranslation: 'error message 4',
      secondExample: 'error message 5',
      secondExampleTranslation: 'error message 6',
    };

    render(<EditWord onEdit={()=>{}} data={{...data.word, error }} />);

    expect(screen.getByText(error.word)).toBeInTheDocument();
    expect(screen.getByText(error.meaning)).toBeInTheDocument();
    expect(screen.getByText(error.firstExample)).toBeInTheDocument();
    expect(screen.getByText(error.firstExampleTranslation)).toBeInTheDocument();
    expect(screen.getByText(error.secondExample)).toBeInTheDocument();
    expect(screen.getByText(error.secondExampleTranslation)).toBeInTheDocument();
  });

  it(`should add the example field to the data if it was undefined and the value of one of the example fields was changed`, () => {
    const onEdit = jest.fn();
    
    render(<EditWord onEdit={onEdit} data={data.withoutExamples} />, );

    const firstExampleTranslation = screen.getByTestId('first-example-translation-text-field');
    fireEvent.change(firstExampleTranslation, { target: { value: 'value' }});

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith({
      ...data.withoutExamples,
      firstExample: {
        example: '',
        translation: 'value'
      },
    });

    const secondExample = screen.getByTestId('second-example-text-field');
    fireEvent.change(secondExample, { target: { value: 'value' }});

    expect(onEdit).toHaveBeenCalledTimes(2);
    expect(onEdit).toHaveBeenCalledWith({
      ...data.withoutExamples,
      secondExample: {
        example: 'value',
        translation: ''
      },
    });
  });
});