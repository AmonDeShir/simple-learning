import * as CloseIcon from '@mui/icons-material/Close';
import * as DeleteIcon from '@mui/icons-material/Delete';
import * as editSetSlice from '../../../../redux/slices/edit-set/edit-set';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MockAudio, mockAudio } from "../../../../utils/mocks/audio-mock";
import { mockIcon, MockIcon } from '../../../../utils/mocks/icon-mock';
import { TestingContainer } from "../../../../utils/test-utils/testing-container";
import { EditSet } from "./edit-set";

const state = {
  editSet: {
    progress: {
      mode: 'loading' as const,
      state: 'success' as const,
      message: '',
    },
    title: 'Set Title',
    isProtected: false,
    words: [
      {
        type: 'create' as const,
        id: '0_0_1',
        word: 'word 1',
        meaning: 'meaning 1',
        error: {}
      },
      {
        type: 'edit' as const,
        id: '0_0_2',
        word: 'word 2',
        meaning: 'meaning 2',
        error: {}
      }
    ],
  }
};

describe(`EditSet`, () => {
  let audio: MockAudio;
  let deleteIcon: MockIcon;
  let closeIcon: MockIcon;
  let scrollSpy = jest.fn();

  beforeAll(() => {
    audio = mockAudio();
    deleteIcon = mockIcon(DeleteIcon, 'delete icon');
    closeIcon = mockIcon(CloseIcon, 'close icon');
    document.body.scrollTo = scrollSpy;
  });

  beforeEach(() => {
    audio.mockClear();
    scrollSpy.mockClear();
  });

  afterAll(() => {
    audio.mockRestore();
    deleteIcon.mockRestore();
    closeIcon.mockRestore();
    (document.body.scrollTo as any) = undefined;
  });

  it(`should render page title`, async () => {
    const { wrapper } = TestingContainer(undefined, state);
    render(<EditSet />, { wrapper });
    
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText('Set Title')).toBeInTheDocument();
  });

  it(`should render words of the edited set`, async () => {
    const { wrapper } = TestingContainer(undefined, state);
    render(<EditSet />, { wrapper });
    
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText('word 1')).toBeInTheDocument();
    expect(screen.getByText('word 2')).toBeInTheDocument();
  });

  it(`should navigate to the bottom of the page`, async () => {
    const { wrapper } = TestingContainer(undefined, state);
    render(<EditSet />, { wrapper });
    
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(scrollSpy).toHaveBeenCalledWith(0, document.body.scrollHeight);
  })

  it(`should show an YesNoDialog if the EditWord's component DeleteIcon is clicked`, async () => {
    const { wrapper } = TestingContainer(undefined, state);
    render(<EditSet />, { wrapper });
    
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    fireEvent.click(screen.getAllByText('delete icon')[0]);

    expect(screen.getByText('Are you sure you want to delete “word 1” word?')).toBeInTheDocument();
  });

  it(`should dispatch the removeWord action if the yes button of the delete YesNoDialog is clicked`, async () => {
    const { wrapper, reduxActions } = TestingContainer(undefined, state);
    render(<EditSet />, { wrapper });
    
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    fireEvent.click(screen.getAllByText('delete icon')[0]);

    await screen.findByText('Are you sure you want to delete “word 1” word?');
    fireEvent.click(screen.getByText('Yes'));

    await waitFor(() => expect(screen.queryByText('Are you sure you want to delete “word 1” word?')).not.toBeInTheDocument());

    expect(reduxActions['editSet/removeWord']).toEqual({
      type: 'editSet/removeWord',
      payload: '0_0_1'
    })
  });

  it(`shouldn't dispatch the removeWord action if the no button of the delete YesNoDialog is clicked`, async () => {
    const { wrapper, reduxActions } = TestingContainer(undefined, state);
    render(<EditSet />, { wrapper });
    
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    fireEvent.click(screen.getAllByText('delete icon')[0]);

    await screen.findByText('Are you sure you want to delete “word 1” word?');
    fireEvent.click(screen.getByText('No'));

    await waitFor(() => expect(screen.queryByText('Are you sure you want to delete “word 1” word?')).not.toBeInTheDocument());

    expect(reduxActions['editSet/removeWord']).toEqual(undefined)
  });

  it(`shouldn't display tex set title textbox if the edited set is protected`, async () => {
    const { wrapper } = TestingContainer(undefined, { editSet: { ...state.editSet, isProtected: true }});
    render(<EditSet />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.queryByText(`Edit set's title`)).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue(`Set Title`)).not.toBeInTheDocument();
  })

  it(`should dispatch the setTitle action if the Set title textbox is edited`, async () => {
    const { wrapper, reduxActions } = TestingContainer(undefined, state);
    render(<EditSet />, { wrapper });
    
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    fireEvent.change(screen.getByDisplayValue('Set Title'), { target: { value: 'new title' } });

    expect(reduxActions['editSet/setTitle']).toEqual({
      type: 'editSet/setTitle',
      payload: 'new title'
    })
  });

  it(`should open the 'new word' page if the 'New Word' button is clicked`, async () => {
    const { wrapper } = TestingContainer(undefined, state);
    render(<EditSet />, { wrapper });
    
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    fireEvent.click(screen.getByText('New Word'));

    expect(screen.getByText('New word page')).toBeInTheDocument();
  });

  it(`should disable the 'Save' button if the set has errors`, () => {
    const { wrapper } = TestingContainer(undefined, {
      ...state,
      editSet: {
        ...state.editSet,
        words: [
          ...state.editSet.words,
          {
            type: 'edit' as const,
            id: '0_0_3',
            word: 'word 3',
            meaning: '',
            error: {
              meaning: 'This field is required.'
            }
          }
        ]
      }
    });
    render(<EditSet />, { wrapper });
    
    expect(screen.getByText('Save')).toHaveAttribute('disabled');
  })

  it(`should dispatch the createSet action if the 'Save' button is clicked`, async () => {
    const createSetSpy = jest.spyOn(editSetSlice, 'createSet');
    const { wrapper } = TestingContainer(undefined, state);
    render(<EditSet />, { wrapper });
    
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    fireEvent.click(screen.getByText('Save'));

    expect(createSetSpy).toBeCalledTimes(1);
    createSetSpy.mockRestore();
  });

  it(`should dispatch the clear action and navigate to the 'set-list' page if the 'Cancel' button is clicked`, async () => {
    const { wrapper, reduxActions } = TestingContainer(undefined, state);
    render(<EditSet />, { wrapper });
    
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    fireEvent.click(screen.getByText('Cancel'));

    expect(reduxActions['editSet/clear']).toEqual({
      type: 'editSet/clear',
      payload: undefined
    })
    
    expect(screen.getByText('Set list page')).toBeInTheDocument();
  });

  it(`should dispatch the clear action and navigate to the 'set-list' page if the redux's progress mode is set to 'saving' and progress state is set to 'success'`, async () => {
    const progress = { mode: 'saving' as const, state: 'success' as const, message: '' };
    const { wrapper, reduxActions } = TestingContainer(undefined, { editSet: { ...state.editSet, progress }});
    render(<EditSet />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(reduxActions['editSet/clear']).toEqual({
      type: 'editSet/clear',
      payload: undefined
    })
    
    expect(screen.getByText('Set list page')).toBeInTheDocument();
  });

  it(`shouldn't navigate to the 'set-list' page if the redux's progress mode is set to 'loading' and progress state is set to 'success'`, async () => {
    const progress = { mode: 'loading' as const, state: 'success' as const, message: '' };
    const { wrapper, reduxActions } = TestingContainer(undefined, { editSet: { ...state.editSet, progress }});
    render(<EditSet />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(reduxActions['editSet/clear']).toBeUndefined();
    expect(screen.queryByText('Set list page')).not.toBeInTheDocument();
  });

  describe('when the one of the words is edited', () => {
    const state = {
      editSet: {
        progress: {
          mode: 'loading' as const,
          state: 'success' as const,
          message: '',
        },
        isProtected: false,
        title: 'Set Title',
        words: [
          {
            type: 'create' as const,
            id: '0_0_1',
            word: 'created word',
            meaning: 'meaning 1',
            error: {},
            usedIn: [
              {
                id: '1',
                title: 'Set 1'
              },
              {
                id: '2',
                title: 'Set 2'
              }
            ]
          },
          {
            type: 'edit' as const,
            id: '0_0_2',
            word: 'edited word',
            meaning: 'meaning 2',
            error: {},
            usedIn: [
              {
                id: '1',
                title: 'Set 1'
              },
              {
                id: '2',
                title: 'Set 2'
              }
            ]
          },
          {
            type: 'import' as const,
            id: '0_0_3',
            word: 'imported word 1',
            meaning: 'meaning 3',
            error: {},
          },
          {
            type: 'import' as const,
            id: '0_0_4',
            word: 'imported word 2',
            meaning: 'meaning 4',
            error: {},
            usedIn: []
          },
          {
            type: 'import' as const,
            id: '0_0_5',
            word: 'imported word 3',
            meaning: 'meaning 5',
            error: {},
            usedIn: [
              {
                id: '1',
                title: 'Set 1'
              },
              {
                id: '2',
                title: 'Set 2'
              }
            ]
          },
          
        ],
      }
    };

    describe('edit dialog', () => {
      it(`should be displayed`, async () => {
        const { wrapper } = TestingContainer(undefined, state);
        render(<EditSet />, { wrapper });
        
        await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
        fireEvent.change(screen.getByDisplayValue('imported word 3'), { target: { value: 'new value' } });
  
        expect(screen.getByText('This definition is used in 2 other sets: “Set 1”, “Set 2”. Do you want to update other definitions?')).toBeInTheDocument();
      });
  
      it(`shouldn't be displayed if the usedIn array of the edited word is an empty array`, async () => {
        const { wrapper } = TestingContainer(undefined, state);
        render(<EditSet />, { wrapper });
        
        await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
        fireEvent.change(screen.getByDisplayValue('imported word 2'), { target: { value: 'new value' } });
  
        expect(screen.queryByText('This definition is used in 0 other set: . Do you want to update other definitions?')).not.toBeInTheDocument();
      });
  
      it(`shouldn't be displayed if the usedIn array of the edited word is undefined`, async () => {
        const { wrapper } = TestingContainer(undefined, state);
        render(<EditSet />, { wrapper });
        
        await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
        fireEvent.change(screen.getByDisplayValue('imported word 1'), { target: { value: 'new value' } });
  
        expect(screen.queryByText('This definition is used in 2 other sets: “Set 1”, “Set 2”. Do you want to update other definitions?')).not.toBeInTheDocument();
      });
  
      it(`shouldn't be displayed if the type of the edited word is 'edit'`, async () => {
        const { wrapper } = TestingContainer(undefined, state);
        render(<EditSet />, { wrapper });
        
        await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
        fireEvent.change(screen.getByDisplayValue('edited word'), { target: { value: 'new value' } });
  
        expect(screen.queryByText('This definition is used in 2 other sets: “Set 1”, “Set 2”. Do you want to update other definitions?')).not.toBeInTheDocument();
      });
  
      it(`shouldn't be displayed if the type of the edited word is 'create'`, async () => {
        const { wrapper } = TestingContainer(undefined, state);
        render(<EditSet />, { wrapper });
        
        await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
        fireEvent.change(screen.getByDisplayValue('created word'), { target: { value: 'new value' } });
  
        expect(screen.queryByText('This definition is used in 2 other sets: “Set 1”, “Set 2”. Do you want to update other definitions?')).not.toBeInTheDocument();
      });
  
      it(`should call the editWord action and set the word type to 'edit' if the user clicks on the 'Yes' button`, async () => {
        const { wrapper, reduxActions } = TestingContainer(undefined, state);
        render(<EditSet />, { wrapper });
        
        await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
        fireEvent.change(screen.getByDisplayValue('imported word 3'), { target: { value: 'new value' } });
  
        await screen.findByText('This definition is used in 2 other sets: “Set 1”, “Set 2”. Do you want to update other definitions?');
        fireEvent.click(screen.getByText('Yes'));
  
        expect(reduxActions['editSet/editWord']).toEqual({
          type: 'editSet/editWord',
          payload: {
            ...state.editSet.words[4],
            word: 'new value',
            type: 'edit',
          }
        });
      });
  
      it(`should call the editWord action and set the word type to 'create' if the user clicks on the 'No' button`, async () => {
        const { wrapper, reduxActions } = TestingContainer(undefined, state);
        render(<EditSet />, { wrapper });
        
        await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
        fireEvent.change(screen.getByDisplayValue('imported word 3'), { target: { value: 'new value' } });
  
        await screen.findByText('This definition is used in 2 other sets: “Set 1”, “Set 2”. Do you want to update other definitions?');
        fireEvent.click(screen.getByText('No'));
  
        expect(reduxActions['editSet/editWord']).toEqual({
          type: 'editSet/editWord',
          payload: {
            ...state.editSet.words[4],
            word: 'new value',
            type: 'create',
            usedIn: [],
          }
        });
      });
  
      it(`shouldn't call the editWord action if the user clicks the close icon`, async () => {
        const { wrapper, reduxActions } = TestingContainer(undefined, state);
        render(<EditSet />, { wrapper });
        
        await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
        fireEvent.change(screen.getByDisplayValue('imported word 3'), { target: { value: 'new value' } });
  
        await screen.findByText('This definition is used in 2 other sets: “Set 1”, “Set 2”. Do you want to update other definitions?');
        fireEvent.click(screen.getByText('close icon'));
  
        expect(reduxActions['editSet/editWord']).toBeUndefined();
      })
    })
    
    it(`should call the editSet action if the type of the edited word is 'edit'`, async () => {
      const { wrapper, reduxActions } = TestingContainer(undefined, state);
      render(<EditSet />, { wrapper });
      
      await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
      fireEvent.change(screen.getByDisplayValue('edited word'), { target: { value: 'new value' } });

      expect(reduxActions['editSet/editWord']).toEqual({
        type: 'editSet/editWord',
        payload: {
          ...state.editSet.words[1],
          word: 'new value',
        }
      });
    });

    it(`should call the editSet action if the type of the edited word is 'create'`, async () => {
      const { wrapper, reduxActions } = TestingContainer(undefined, state);
      render(<EditSet />, { wrapper });
      
      await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
      fireEvent.change(screen.getByDisplayValue('created word'), { target: { value: 'new value' } });

      expect(reduxActions['editSet/editWord']).toEqual({
        type: 'editSet/editWord',
        payload: {
          ...state.editSet.words[0],
          word: 'new value',
        }
      });
    });

    it(`should call the editSet action and set the word type to 'edit' if the type of the edited word is 'import' and the word's usedIn is undefined`, async () => {
      const { wrapper, reduxActions } = TestingContainer(undefined, state);
      render(<EditSet />, { wrapper });
      
      await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
      fireEvent.change(screen.getByDisplayValue('imported word 1'), { target: { value: 'new value' } });

      expect(reduxActions['editSet/editWord']).toEqual({
        type: 'editSet/editWord',
        payload: {
          ...state.editSet.words[2],
          word: 'new value',
          type: 'edit',
        }
      });
    });

    it(`should call the editSet action and set the word type to 'edit' if the type of the edited word is 'import' and the word's usedIn is an empty array`, async () => {
      const { wrapper, reduxActions } = TestingContainer(undefined, state);
      render(<EditSet />, { wrapper });
      
      await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
      fireEvent.change(screen.getByDisplayValue('imported word 2'), { target: { value: 'new value' } });

      expect(reduxActions['editSet/editWord']).toEqual({
        type: 'editSet/editWord',
        payload: {
          ...state.editSet.words[3],
          word: 'new value',
          type: 'edit',
        }
      });
    });
  });
})