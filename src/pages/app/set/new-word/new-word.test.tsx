import { act, fireEvent, render, screen } from "@testing-library/react";
import { TestingContainer } from "../../../../utils/test-utils/testing-container";
import { NewWord } from "./new-word";
import * as SelectDefinition from './select-definition';
import * as CreateDefinition from './create-definition';
import { mockAudio, MockAudio } from "../../../../utils/mocks/audio-mock";

describe('NewWord', () => {
  let audio: MockAudio;

  beforeAll(() => {
    audio = mockAudio();
  });

  beforeEach(() => {
    audio.mockClear();
  });
  
  afterAll(() => {
    audio.mockRestore();
  });

  it(`should render page title`, () => {
    const { wrapper } = TestingContainer();
    render(<NewWord />, { wrapper });
    
    expect(screen.getByText('New word')).toBeInTheDocument();
  });

  it(`should render the page in the 'create' mode`, () => {
    const { wrapper } = TestingContainer();
    render(<NewWord />, { wrapper });

    expect(screen.getByText('Define your definition using the text boxes below (the example fields are optional)')).toBeInTheDocument();
    expect(screen.getByText('or just select a definition from the')).toBeInTheDocument();
    expect(screen.getByText('Dictionary')).toBeInTheDocument();
  })

  it(`should change the page mode to the 'select' mode if the 'Dictionary' button is clicked`, async () => {
    const { wrapper } = TestingContainer();
    render(<NewWord />, { wrapper });

    fireEvent.click(screen.getByText('Dictionary'));
    await screen.findByText('Loading please wait...');

    expect(screen.getByText('Import word definition from an online dictionary or from one of your sets, you can also add your own custom definition')).toBeInTheDocument();
    expect(screen.getByText('or just add your own custom')).toBeInTheDocument();
    expect(screen.getByText('Definition')).toBeInTheDocument();
  });

  it(`should open the 'edit set' page if the 'Cancel' button is clicked`, () => {
    const { wrapper } = TestingContainer();
    render(<NewWord />, { wrapper });

    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.getByText('Edit set page')).toBeInTheDocument();
  });
  
  it(`should call the 'addWord' action and open the 'edit set' page if the 'Save' button is clicked`, () => {
    const { wrapper, reduxActions } = TestingContainer();
    render(<NewWord />, { wrapper });

    fireEvent.click(screen.getByText('Save'));

    expect(reduxActions['editSet/addWord']).toEqual({
      type: 'editSet/addWord',
      payload: {
        word: 'New Word',
        meaning: 'Translation',
        type: 'create',
        error: {},
      },
    });

    expect(screen.getByText('Edit set page')).toBeInTheDocument();
  });


  it(`should change the page mode to the 'create' mode and load the definition's data if the user selects an definition to import`, async () => {
    let select: (data: any) => void;
    
    const selectDefinitionSpy = jest.spyOn(SelectDefinition, 'SelectDefinition');
    selectDefinitionSpy.mockImplementation(({ onSelect }: any) => {
      select = onSelect;
      return <></>
    })
    
    const { wrapper, reduxActions } = TestingContainer();
    render(<NewWord />, { wrapper });

    fireEvent.click(screen.getByText('Dictionary'));
    
    act(() => { select({
      word: 'Selected word',
      meaning: 'Translation',
      type: 'import',
      error: {}
    })});

    await screen.findByText('Define your definition using the text boxes below (the example fields are optional)');
    fireEvent.click(screen.getByText('Save'));

    expect(reduxActions['editSet/addWord']).toEqual({
      type: 'editSet/addWord',
      payload: {
        word: 'Selected word',
        meaning: 'Translation',
        type: 'import',
        error: {}
      },
    });

    expect(screen.getByText('Edit set page')).toBeInTheDocument();
    selectDefinitionSpy.mockRestore();
  });

  it(`should update the definition's data if the user edit the definition`, async () => {
    let edit: (data: any) => void;
    
    const createDefinitionSpy = jest.spyOn(CreateDefinition, 'CreateDefinition');
    createDefinitionSpy.mockImplementation(({ onEdit }: any) => {
      edit = onEdit;
      return <></>
    })
    
    const { wrapper, reduxActions } = TestingContainer();
    render(<NewWord />, { wrapper });
    
    act(() => { edit({
      word: 'Edited word',
      meaning: 'Translation',
      type: 'create',
      error: {}
    })});

    fireEvent.click(screen.getByText('Save'));

    expect(reduxActions['editSet/addWord']).toEqual({
      type: 'editSet/addWord',
      payload: {
        word: 'Edited word',
        meaning: 'Translation',
        type: 'create',
        error: {}
      },
    });

    expect(screen.getByText('Edit set page')).toBeInTheDocument();
    createDefinitionSpy.mockRestore();
  });

  it(`should disable the 'Save' button if the word textfield is empty`, async () => {
    let edit: (data: any) => void;
    
    const createDefinitionSpy = jest.spyOn(CreateDefinition, 'CreateDefinition');
    createDefinitionSpy.mockImplementation(({ onEdit }: any) => {
      edit = onEdit;
      return <></>
    })

    const { wrapper } = TestingContainer();
    render(<NewWord />, { wrapper });

    act(() => { edit({
      word: '',
      meaning: 'Translation',
      type: 'create',
      error: {}
    })});

    expect(screen.getByText('Save')).toHaveAttribute('disabled');
    createDefinitionSpy.mockRestore();
  });

  it(`should disable the 'Save' button if the translation textfield is empty`, async () => {
    let edit: (data: any) => void;
    
    const createDefinitionSpy = jest.spyOn(CreateDefinition, 'CreateDefinition');
    createDefinitionSpy.mockImplementation(({ onEdit }: any) => {
      edit = onEdit;
      return <></>
    })

    const { wrapper } = TestingContainer();
    render(<NewWord />, { wrapper });

    act(() => { edit({
      word: 'word 1',
      meaning: '',
      type: 'create',
      error: {}
    })});

    expect(screen.getByText('Save')).toHaveAttribute('disabled');
    createDefinitionSpy.mockRestore();
  });
});