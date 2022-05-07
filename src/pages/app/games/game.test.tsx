import * as gameSlice from "../../../redux/slices/game/game";
import * as FlippingInputCard from '../../../components/flipping-card/flipping-input-card';
import { fireEvent, render, screen } from "@testing-library/react";
import { TestingContainer } from "../../../utils/test-utils/testing-container";
import { Game } from "./game";
import { act } from "react-dom/test-utils";
import { mockAudio, MockAudio } from "../../../utils/mocks/audio-mock";

const state = { 
  game: {
    progress: 'loading-success' as const,
    mode: 'mix' as const,
    setId: '0102',
    items: [
      {
        id: '1',
        inGameId: '1--0',
        text: 'item 1',
        translation: 'translation',
        invert: false,
        mode: 'flashcard' as const,
      },
      {
        id: '2',
        inGameId: '2--0',
        text: 'item 2',
        translation: 'translation',
        invert: false,
        mode: 'writing' as const,
      },
      {
        id: '3',
        inGameId: '3--0',
        text: 'item 3',
        translation: 'translation',
        invert: false,
        mode: 'speller' as const,
      },
      {
        id: '4',
        inGameId: '4--0',
        text: 'item 4',
        translation: 'translation',
        invert: false,
        mode: 'flashcard' as const,
      },
      {
        id: '5',
        inGameId: '5--0',
        text: 'item 5',
        translation: 'translation',
        invert: false,
        mode: 'flashcard' as const,
      }
    ],
    correct: ["4"],
    incorrect: ["5"],
    remaining: ["1", "2", "3"],
    item: '1',
    itemIndex: 2,
    getItemsFrom: 'remaining' as const,
    statistics: {
      correct: [
        {
          id: '4',
          inGameId: '4--0',
          text: 'item 4',
          translation: 'translation',
          invert: false,
          mode: 'flashcard' as const,
        },
      ],
      incorrect: [
        {
          id: '5',
          inGameId: '5--0',
          text: 'item 5',
          translation: 'translation',
          invert: false,
          mode: 'flashcard' as const,
        }
      ],
      items: ["4", "5"],
    }
  }  
}

describe('Game', () => {
  let loadSetSpy: jest.SpyInstance;
  let answerSpy: jest.SpyInstance;
  let audio: MockAudio;

  beforeAll(() => {
    loadSetSpy = jest.spyOn(gameSlice, 'loadSet');
    answerSpy = jest.spyOn(gameSlice, 'answer');
    jest.useFakeTimers();
    audio = mockAudio();
  });

  beforeEach(() => {
    loadSetSpy.mockClear();
    loadSetSpy.mockImplementation(() => ({
      type: 'game/mockedAction',
      payload: undefined
    }));

    answerSpy.mockClear();
    answerSpy.mockImplementation(() => ({
      type: 'game/mockedAction',
      payload: undefined
    }));

    audio.mockClear();
  });
  
  afterAll(() => {
    loadSetSpy.mockRestore();
    answerSpy.mockRestore();
    jest.useRealTimers();
    audio.mockRestore();
  });

  it(`should dispatch the loadSet action`, () => {
    const { wrapper } = TestingContainer({ setId: "0102", mode: 'mix' });
    render(<Game />, { wrapper });

    expect(loadSetSpy).toHaveBeenCalledWith({ id: "0102", mode: 'mix' });
  });

  it(`should display a loading message if the progress is 'idle'`, () => {
    const gameState = {
      game: {
        ...state.game,
        progress: 'idle' as const
      }
    }

    const { wrapper } = TestingContainer({ setId: "0102", mode: 'mix' }, gameState);
    render(<Game />, { wrapper });

    expect(screen.getByText('Loading please wait...')).toBeInTheDocument();
  })

  it(`should display a loading message if the progress is 'loading-pending'`, () => {
    const gameState = {
      game: {
        ...state.game,
        progress: 'loading-pending' as const
      }
    }
    
    const { wrapper } = TestingContainer({ setId: "0102", mode: 'mix' }, gameState);
    render(<Game />, { wrapper });

    expect(screen.getByText('Loading please wait...')).toBeInTheDocument();
  })

  it(`should display an error message if the progress is 'loading-error'`, () => {
    const gameState = {
      game: {
        ...state.game,
        progress: 'loading-error' as const
      }
    }

    const { wrapper } = TestingContainer({ setId: "0102", mode: 'mix' }, gameState);
    render(<Game />, { wrapper });

    expect(screen.getByText('There was an error. Please try again')).toBeInTheDocument();
  })

  it(`should display an empty message if the progress is 'loading-success' but there is no game items`, () => {
    const gameState = {
      ...state,
      game: {
        ...state.game,
        progress: 'loading-success' as const,
        items: []
      }
    }

    const { wrapper } = TestingContainer({ setId: "0102", mode: 'mix' }, gameState);
    render(<Game />, { wrapper });

    expect(screen.getByText('Before you start playing, please add some words to the set.')).toBeInTheDocument();
  })

  it(`should display a game mode as a page title`, () => {
    const { wrapper } = TestingContainer({ setId: "0102", mode: 'mix' }, state);
    render(<Game />, { wrapper });

    expect(screen.getByText('Correct 1 / 5')).toBeInTheDocument();
    expect(screen.getByText('Incorrect 1 / 5')).toBeInTheDocument();
    expect(screen.getByText('Remaining 3 / 5')).toBeInTheDocument();
  });

  it(`should display three progress bars`, () => {
    const { wrapper } = TestingContainer({ setId: "0102", mode: 'mix' }, state);
    render(<Game />, { wrapper });

    expect(screen.getByText('Mix')).toBeInTheDocument();
  });

  it(`should display the statistic card if the progress is 'done'`, () => {
    const gameState = {
      ...state,
      game: {
        ...state.game,
        progress: 'done' as const
      }
    }

    const { wrapper } = TestingContainer({ setId: "0102", mode: 'mix' }, gameState);
    render(<Game />, { wrapper });

    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('Corrects')).toBeInTheDocument();
    expect(screen.getByText('Wrongs')).toBeInTheDocument();
  });

  it(`should open the 'set' page if the statistic card is clicked`, () => {
    const gameState = {
      ...state,
      game: {
        ...state.game,
        progress: 'done' as const
      }
    }

    const { wrapper } = TestingContainer({ setId: "0102", mode: 'mix' }, gameState);
    render(<Game />, { wrapper });

    fireEvent.click(screen.getByText('Done'));

    expect(screen.getByText('Set page')).toBeInTheDocument();
    expect(screen.getByText('0102')).toBeInTheDocument();
  });

  it(`should display the FlippingInputCard component if the item's mode is 'writing'`, () => {
    const gameState = {
      ...state,
      game: {
        ...state.game,
        item: '2',
      }
    }

    const { wrapper } = TestingContainer({ setId: "0102", mode: 'mix' }, gameState);
    render(<Game />, { wrapper });

    expect(screen.getByTestId('flipping-input-card-textbox')).toBeInTheDocument();
  });

  it(`should display the FlippingInputCard component if the item's mode is 'speller'`, () => {
    const gameState = {
      ...state,
      game: {
        ...state.game,
        item: '3',
      }
    }

    const { wrapper } = TestingContainer({ setId: "0102", mode: 'mix' }, gameState);
    render(<Game />, { wrapper });

    expect(screen.getByTestId('flipping-input-card-textbox')).toBeInTheDocument();
  });


  it(`should display the FlippingCard component if the item's mode isn't 'speller' or 'writing'`, () => {
    const gameState = {
      ...state,
      game: {
        ...state.game,
        item: '1',
      }
    }

    const { wrapper } = TestingContainer({ setId: "0102", mode: 'mix' }, gameState);
    render(<Game />, { wrapper });

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Translation')).toBeInTheDocument();
    expect(screen.queryByTestId('flipping-input-card-textbox')).not.toBeInTheDocument();
  });

  it(`should dispatch the 'answer' action if the FlippingInputCard's Answer button is clicked`, () => {
    const gameState = {
      ...state,
      game: {
        ...state.game,
        item: '3',
      }
    }

    const AnswerMock = (props: { onAnswer: (value: boolean) => void, data: { text: string }}) => (
      <div onClick={() => props.onAnswer(true)}>{props.data.text}</div>
    );

    const flippingCardSpy = jest.spyOn(FlippingInputCard, 'FlippingInputCard');
    flippingCardSpy.mockImplementation(AnswerMock as any);

    const { wrapper } = TestingContainer({ setId: "0102", mode: 'mix' }, gameState);
    render(<Game />, { wrapper });
 
    fireEvent.click(screen.getByText('item 3'));
    act(() => { jest.advanceTimersByTime(250)});

    expect(answerSpy).toBeCalledWith(false);
    flippingCardSpy.mockRestore();
  });

  it(`should display buttons if the FlippingCard is clicked`, () => {
    const gameState = {
      ...state,
      game: {
        ...state.game,
        item: '1',
      }
    }

    const { wrapper } = TestingContainer({ setId: "0102", mode: 'mix' }, gameState);
    render(<Game />, { wrapper });

    fireEvent.click(screen.getByText('Item 1'));

    expect(screen.getByText('Good')).toBeInTheDocument();
    expect(screen.getByText('Again')).toBeInTheDocument();
  });

  it(`should dispatch the 'answer' action if the 'Good' button is clicked`, () => {
    const gameState = {
      ...state,
      game: {
        ...state.game,
        item: '1',
      }
    }

    const { wrapper } = TestingContainer({ setId: "0102", mode: 'mix' }, gameState);
    render(<Game />, { wrapper });

    fireEvent.click(screen.getByText('Item 1'));
    fireEvent.click(screen.getByText('Good'));

    act(() => { jest.advanceTimersByTime(250)});

    expect(answerSpy).toBeCalledWith(true);
  });

  it(`should dispatch the 'answer' action if the 'Bad' button is clicked`, () => {
    const gameState = {
      ...state,
      game: {
        ...state.game,
        item: '1',
      }
    }

    const { wrapper } = TestingContainer({ setId: "0102", mode: 'mix' }, gameState);
    render(<Game />, { wrapper });

    fireEvent.click(screen.getByText('Item 1'));
    fireEvent.click(screen.getByText('Again'));

    act(() => { jest.advanceTimersByTime(250)});

    expect(answerSpy).toBeCalledWith(false);
  });
})