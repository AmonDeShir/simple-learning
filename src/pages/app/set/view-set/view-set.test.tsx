import * as EditIcon from '@mui/icons-material/Edit';
import * as editSetSlice from '../../../../redux/slices/edit-set/edit-set';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mockAudio, MockAudio } from "../../../../utils/mocks/audio-mock";
import { TestingContainer } from "../../../../utils/test-utils/testing-container";
import { ViewSet } from "./view-set";
import mediaQuery from 'css-mediaquery';
import { mockIcon, MockIcon } from "../../../../utils/mocks/icon-mock";

function createMatchMedia(width: number) {
  return (query: any) => ({
    matches: mediaQuery.match(query, {
      width,
    }),
    addListener: () => {},
    removeListener: () => {},
  });
}

describe(`ViewSet`, () => {
  let audio: MockAudio;
  let editIcon: MockIcon;
  let editSetOrigin = editSetSlice.editSet;
  let editSetSpy: jest.SpyInstance;

  beforeAll(() => {
    audio = mockAudio();
    editIcon = mockIcon(EditIcon);
    editSetSpy = jest.spyOn(editSetSlice, 'editSet');
  });

  beforeEach(() => {
    audio.mockClear();
    editSetSpy.mockClear();
    editSetSpy.mockImplementation(editSetOrigin);
  });

  afterAll(() => {
    audio.mockRestore();
    editIcon.mockRestore();
    editSetSpy.mockRestore();
  });

  it(`should render the page title`, async () => {
    const { wrapper } = TestingContainer({ setId: '0102' }, { user: { name: 'Test User', sync: false }});
    render(<ViewSet />, { wrapper });
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText('Test set 1')).toBeInTheDocument();
  });

  it(`should load words`, async () => {
    const { wrapper } = TestingContainer({ setId: '0102' }, { user: { name: 'Test User', sync: false }});
    render(<ViewSet />, { wrapper });
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText('word 1')).toBeInTheDocument();
    expect(screen.getByText('word 2')).toBeInTheDocument();
  })

  it(`should display an error message if the fetch is unsuccessful`, async () => {
    const { wrapper } = TestingContainer({ setId: 'error' }, { user: { name: 'Test User', sync: false }});
    render(<ViewSet />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText('There was an error. Please try again')).toBeInTheDocument();
  });

  describe('games', () => {
    it(`should the 'game' page in the flashcards mode if the 'Flashcards' button is clicked`, async () => {
      const { wrapper } = TestingContainer({ setId: '0102' }, { user: { name: 'Test User', sync: false }});
      render(<ViewSet />, { wrapper });
      
      await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
      fireEvent.click(screen.getByText('Flashcards'));

      expect(screen.getByText('Game page')).toBeInTheDocument();
      expect(screen.getByText('flashcards - 0102')).toBeInTheDocument();
    })

    it(`should the 'game' page in the writing mode if the 'Writing' button is clicked`, async () => {
      const { wrapper } = TestingContainer({ setId: '0102' }, { user: { name: 'Test User', sync: false }});
      render(<ViewSet />, { wrapper });
      
      await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
      fireEvent.click(screen.getByText('Writing'));

      expect(screen.getByText('Game page')).toBeInTheDocument();
      expect(screen.getByText('writing - 0102')).toBeInTheDocument();
    })

    it(`should the 'game' page in the speller mode if the 'Speller' button is clicked`, async () => {
      const { wrapper } = TestingContainer({ setId: '0102' }, { user: { name: 'Test User', sync: false }});
      render(<ViewSet />, { wrapper });
      
      await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
      fireEvent.click(screen.getByText('Speller'));

      expect(screen.getByText('Game page')).toBeInTheDocument();
      expect(screen.getByText('speller - 0102')).toBeInTheDocument();
    })

    it(`should the 'game' page in the mix mode if the 'Mix' button is clicked`, async () => {
      const { wrapper } = TestingContainer({ setId: '0102' }, { user: { name: 'Test User', sync: false }});
      render(<ViewSet />, { wrapper });
      
      await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
      fireEvent.click(screen.getByText('Mix'));

      expect(screen.getByText('Game page')).toBeInTheDocument();
      expect(screen.getByText('mix - 0102')).toBeInTheDocument();
    })
  })

  it(`should open the 'edit-set' page and call the editSet action if an 'Edit' icon is clicked`, async () => {
    const { wrapper } = TestingContainer({ setId: '0102' }, { user: { name: 'Test User', sync: false }});
    render(<ViewSet />, { wrapper });
    
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    fireEvent.click(screen.getAllByText('Icon')[0]);

    expect(screen.getByText('Edit set page')).toBeInTheDocument();
    expect(editSetSpy).toBeCalledTimes(1);
    expect(editSetSpy).toBeCalledWith('0102');
  });

  it(`should render the 'Words in the set' between action buttons if the page is rendered on the pc`, async () => {
    const { wrapper } = TestingContainer({ setId: '0102' }, { user: { name: 'Test User', sync: false }});
    window.matchMedia = createMatchMedia(1500) as any;

    render(<ViewSet />, { wrapper });
    
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    const buttonsContainer = screen.getByTestId('action-buttons');

    expect(buttonsContainer).toContainElement(screen.getByText('Words in the set'));
  })

  it(`should render the 'Words in the set' outside of buttons container if the page is rendered on the mobile device`, async () => {
    const { wrapper } = TestingContainer({ setId: '0102' }, { user: { name: 'Test User', sync: false }});
    window.matchMedia = createMatchMedia(500) as any;

    render(<ViewSet />, { wrapper });
    
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    const buttonsContainer = screen.getByTestId('action-buttons');

    expect(screen.getByText('Words in the set')).toBeInTheDocument();
    expect(buttonsContainer).not.toContainElement(screen.getByText('Words in the set'));
  })
})

