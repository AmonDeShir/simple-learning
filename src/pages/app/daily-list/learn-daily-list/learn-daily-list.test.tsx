import * as learnSlice from "../../../../redux/slices/learn/learn";
import * as FlippingInputCard from '../../../../components/flipping-card/flipping-input-card';
import { fireEvent, render, screen } from "@testing-library/react";
import { TestingContainer } from "../../../../utils/test-utils/testing-container";
import { LearnDailyList } from "./learn-daily-list";
import { act } from "react-dom/test-utils";
import { mockAudio, MockAudio } from "../../../../utils/mocks/audio-mock";
import { mockTimeline, MockTimeline } from "../../../../utils/mocks/gsap-timeline-mock";

const state = { 
  learn: {
    progress: {
      mode: 'loading' as const,
      state: 'success' as const,
      message: '',
    },
    items: [
      {
        id: '1',
        inGameId: '1--0',
        text: 'item 1',
        translation: 'translation 1',
        invert: false,
        set: 'set_id_0',
        mode: 'flashcard' as const,
        progress: {
          eFactor: 2.5,
          interval: 0,
          intervalBeforeLearning: 0,
          phase: "learning" as const,
          nextRepetition: 1
        },
      },
      {
        id: '2',
        inGameId: '2--0',
        text: 'item 2',
        translation: 'translation 2',
        invert: false,
        set: 'set_id_0',
        mode: 'writing' as const,
        progress: {
          eFactor: 2.5,
          interval: 0,
          intervalBeforeLearning: 0,
          phase: "learning" as const,
          nextRepetition: 1
        },
      },
      {
        id: '3',
        inGameId: '3--0',
        text: 'item 3',
        translation: 'translation 3',
        invert: false,
        set: 'set_id_0',
        mode: 'information' as const,
        progress: {
          eFactor: 2.5,
          interval: 0,
          intervalBeforeLearning: 0,
          phase: "learning" as const,
          nextRepetition: 1
        },
      },
      {
        id: '4',
        inGameId: '4--0',
        text: 'item 4',
        translation: 'translation 4',
        invert: false,
        set: 'set_id_0',
        mode: 'flashcard' as const,
        progress: {
          eFactor: 2.5,
          interval: 0,
          intervalBeforeLearning: 0,
          phase: "learning" as const,
          nextRepetition: 1
        },
      },
      {
        id: '5',
        inGameId: '5--0',
        text: 'item 5',
        translation: 'translation 5',
        invert: false,
        set: 'set_id_0',
        mode: 'flashcard' as const,
        progress: {
          eFactor: 2.5,
          interval: 0,
          intervalBeforeLearning: 0,
          phase: "learning" as const,
          nextRepetition: 1
        },
      }
    ],
    done: ["4"],
    learning: ["5"],
    remaining: ["1", "2", "3"],
    itemIndex: 2,
    getItemsFrom: 'remaining' as const,
    item: '1',
    statistics: {
      "4": {
        answers: [1, 1],
        nextRepetition: 1651774590727,
      },
      "5": {
        answers: [0, 0.5],
        nextRepetition: 1651860990727,
      },
    }
  }  
}

describe('LearnDailyList', () => {
  let loadDataSpy: jest.SpyInstance;
  let saveProgressSpy: jest.SpyInstance;
  let answerSpy: jest.SpyInstance;
  let audio: MockAudio;
  let timelineSpy: MockTimeline;

  beforeAll(() => {
    loadDataSpy = jest.spyOn(learnSlice, 'loadData');
    saveProgressSpy = jest.spyOn(learnSlice, 'saveProgress');
    answerSpy = jest.spyOn(learnSlice, 'answer');
    jest.useFakeTimers();
    audio = mockAudio();
    timelineSpy = mockTimeline();
  });

  beforeEach(() => {
    loadDataSpy.mockClear();
    loadDataSpy.mockImplementation(() => ({
      type: 'learnSlice/mockedAction',
      payload: undefined
    }));

    saveProgressSpy.mockClear();
    saveProgressSpy.mockImplementation(() => ({
      type: 'learnSlice/mockedAction',
      payload: undefined
    }));

    answerSpy.mockClear();
    answerSpy.mockImplementation(() => ({
      type: 'learnSlice/mockedAction',
      payload: undefined
    }));

    audio.mockClear();
    timelineSpy.mockClear();
  });
  
  afterAll(() => {
    loadDataSpy.mockRestore();
    saveProgressSpy.mockRestore();
    answerSpy.mockRestore();
    jest.useRealTimers();
    audio.mockRestore();
    timelineSpy.mockRestore();
  });

  it(`should dispatch the loadSet action`, () => {
    const { wrapper } = TestingContainer();
    render(<LearnDailyList />, { wrapper });

    expect(loadDataSpy).toHaveBeenCalledTimes(1);
  });

  it(`should dispatch the saveProgress action of the mode of the progress is 'done'`, () => {
    const learnState = {
      progress: {
        mode: 'done' as const,
        state: 'loading' as const,
        message: ''
      }
    }

    const { wrapper } = TestingContainer(undefined, { learn: { ...state.learn, ...learnState }});
    render(<LearnDailyList />, { wrapper });

    expect(loadDataSpy).toHaveBeenCalledTimes(1);
  });


  it(`should display a loading message if the state of the progress is 'loading'`, () => {
    const learnState = {
      progress: {
        mode: 'loading' as const,
        state: 'loading' as const,
        message: ''
      }
    }

    const { wrapper } = TestingContainer(undefined, { learn: { ...state.learn, ...learnState }});
    render(<LearnDailyList />, { wrapper });

    expect(screen.getByText('Loading please wait...')).toBeInTheDocument();
  })

  it(`should display an error message if the state of the progress is 'error'`, () => {
    const learnState = {
      progress: {
        mode: 'saving' as const,
        state: 'error' as const,
        message: 'There was an error. Please try again',
      }
    }

    const { wrapper } = TestingContainer(undefined, { learn: { ...state.learn, ...learnState }});
    render(<LearnDailyList />, { wrapper });

    expect(screen.getByText('There was an error. Please try again')).toBeInTheDocument();
  })

  it(`should display an empty message if the state of the progress is 'empty'`, () => {
    const learnState = {
      progress: {
        mode: 'loading' as const,
        state: 'empty' as const,
        message: 'There is nothing to learn for today, please try again tomorrow or add some words',
      }
    }

    const { wrapper } = TestingContainer(undefined, { learn: { ...state.learn, ...learnState }});
    render(<LearnDailyList />, { wrapper });

    expect(screen.getByText('There is nothing to learn for today, please try again tomorrow or add some words')).toBeInTheDocument();
  })

  it(`should display the page title`, () => {
    const { wrapper } = TestingContainer(undefined, state);
    render(<LearnDailyList />, { wrapper });

    expect(screen.getByText('Learn daily list')).toBeInTheDocument();
  });

  it(`should display three progress bars`, () => {
    const { wrapper } = TestingContainer(undefined, state);
    render(<LearnDailyList />, { wrapper });

    expect(screen.getByText('Done 1 / 5')).toBeInTheDocument();
    expect(screen.getByText('Learning 1 / 5')).toBeInTheDocument();
    expect(screen.getByText('Remaining 3 / 5')).toBeInTheDocument();
  });

  it(`should display the statistic card if the progress' mode is 'saving' and the state is 'success'`, () => {
    const learnState = {
      progress: {
        mode: 'saving' as const,
        state: 'success' as const,
        message: ''
      }
    }
    const { wrapper } = TestingContainer(undefined, { learn: { ...state.learn, ...learnState }});
    render(<LearnDailyList />, { wrapper });

    expect(screen.getByText('item 4')).toBeInTheDocument();
    expect(screen.getByText('translation 4')).toBeInTheDocument();
    expect(screen.getByText('05/05/2022')).toBeInTheDocument();
    expect(screen.getByText('100%, 100%')).toBeInTheDocument();

    expect(screen.getByText('item 5')).toBeInTheDocument();
    expect(screen.getByText('translation 5')).toBeInTheDocument();
    expect(screen.getByText('05/06/2022')).toBeInTheDocument();
    expect(screen.getByText('0%, 50%')).toBeInTheDocument();
  });

  it(`should open the main page if the statistic card is clicked`, () => {
    const learnState = {
      progress: {
        mode: 'saving' as const,
        state: 'success' as const,
        message: ''
      }
    }

    const { wrapper } = TestingContainer(undefined, { learn: { ...state.learn, ...learnState }});
    render(<LearnDailyList />, { wrapper });

    fireEvent.click(screen.getByText('Done'));

    expect(screen.getByText('Main Page')).toBeInTheDocument();
  });

  it(`should display the FlippingInputCard component if the item's mode is 'writing'`, () => {
    const learnState = {
      ...state,
      learn: {
        ...state.learn,
        item: '2',
      }
    }

    const { wrapper } = TestingContainer(undefined, learnState);
    render(<LearnDailyList />, { wrapper });

    expect(screen.getByTestId('flipping-input-card-textbox')).toBeInTheDocument();
  });

  it(`should display the FlippingCard component if the item's mode is 'flashcard'`, () => {
    const learnState = {
      ...state,
      learn: {
        ...state.learn,
        item: '1',
      }
    }

    const { wrapper } = TestingContainer(undefined, learnState);
    render(<LearnDailyList />, { wrapper });

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Translation 1')).toBeInTheDocument();
    expect(screen.queryByTestId('flipping-input-card-textbox')).not.toBeInTheDocument();
  });

  it(`should display the FlippingCard component if the item's mode is 'information'`, () => {
    const learnState = {
      ...state,
      learn: {
        ...state.learn,
        item: '3',
      }
    }

    const { wrapper } = TestingContainer(undefined, learnState);
    render(<LearnDailyList />, { wrapper });

    expect(screen.getByText('Item 3')).toBeInTheDocument();
    expect(screen.getByText('Translation 3')).toBeInTheDocument();
    expect(screen.queryByTestId('flipping-input-card-textbox')).not.toBeInTheDocument();
  });

  it(`should dispatch the 'answer' action if the item's mode is 'information' and the FlippingCard component is flipped to the back side`, () => {
    const learnState = {
      ...state,
      learn: {
        ...state.learn,
        item: '3',
      }
    }

    const { wrapper } = TestingContainer(undefined, learnState);
    render(<LearnDailyList />, { wrapper });

    fireEvent.click(screen.getByText('Item 3'));
    fireEvent.click(screen.getByText('Translation 3'));

    act(() => { jest.advanceTimersByTime(250)});

    expect(answerSpy).toBeCalledWith(1);
  });

  it(`should dispatch the 'answer' action if the FlippingInputCard's Answer button is clicked`, () => {
    const learnState = {
      ...state,
      learn: {
        ...state.learn,
        item: '2',
      }
    }

    const AnswerMock = (props: { onAnswer: (value: number) => void, data: { text: string }}) => (
      <div onClick={() => props.onAnswer(1)}>{props.data.text}</div>
    );

    const flippingCardSpy = jest.spyOn(FlippingInputCard, 'FlippingInputCard');
    flippingCardSpy.mockImplementation(AnswerMock as any);

    const { wrapper } = TestingContainer(undefined, learnState);
    render(<LearnDailyList />, { wrapper });
 
    fireEvent.click(screen.getByText('item 2'));
    act(() => { jest.advanceTimersByTime(250)});

    expect(answerSpy).toBeCalledWith(1);
    flippingCardSpy.mockRestore();
  });

  it(`should display buttons if the item's mode is 'flashcard' and the FlippingCard is clicked`, () => {
    const learnState = {
      ...state,
      learn: {
        ...state.learn,
        item: '1',
      }
    }

    const { wrapper } = TestingContainer(undefined, learnState);
    render(<LearnDailyList />, { wrapper });

    fireEvent.click(screen.getByText('Item 1'));

    expect(screen.getByText('Again')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Very Easy')).toBeInTheDocument();
  });

  it(`should dispatch the 'answer' action if the 'Again' button is clicked`, () => {
    const learnState = {
      ...state,
      learn: {
        ...state.learn,
        item: '1',
      }
    }

    const { wrapper } = TestingContainer(undefined, learnState);
    render(<LearnDailyList />, { wrapper });

    fireEvent.click(screen.getByText('Item 1'));
    fireEvent.click(screen.getByText('Again'));

    act(() => { jest.advanceTimersByTime(250)});

    expect(answerSpy).toBeCalledWith(0);
  });

  it(`should dispatch the 'answer' action if the 'Good' button is clicked`, () => {
    const learnState = {
      ...state,
      learn: {
        ...state.learn,
        item: '1',
      }
    }

    const { wrapper } = TestingContainer(undefined, learnState);
    render(<LearnDailyList />, { wrapper });

    fireEvent.click(screen.getByText('Item 1'));
    fireEvent.click(screen.getByText('Good'));

    act(() => { jest.advanceTimersByTime(250)});

    expect(answerSpy).toBeCalledWith(0.4);
  });

  it(`should dispatch the 'answer' action if the 'Easy' button is clicked`, () => {
    const learnState = {
      ...state,
      learn: {
        ...state.learn,
        item: '1',
      }
    }

    const { wrapper } = TestingContainer(undefined, learnState);
    render(<LearnDailyList />, { wrapper });

    fireEvent.click(screen.getByText('Item 1'));
    fireEvent.click(screen.getByText('Easy'));

    act(() => { jest.advanceTimersByTime(250)});

    expect(answerSpy).toBeCalledWith(0.8);
  });

  it(`should dispatch the 'answer' action if the 'Very Easy' button is clicked`, () => {
    const learnState = {
      ...state,
      learn: {
        ...state.learn,
        item: '1',
      }
    }

    const { wrapper } = TestingContainer(undefined, learnState);
    render(<LearnDailyList />, { wrapper });

    fireEvent.click(screen.getByText('Item 1'));
    fireEvent.click(screen.getByText('Very Easy'));

    act(() => { jest.advanceTimersByTime(250)});

    expect(answerSpy).toBeCalledWith(1);
  });

  describe('button descriptions', () => {
    it(`should display the next repetition as one minute if the next repetition is lesser than 1 minute`, () => {
      const items = [
        {
          ...state.learn.items[0],
          progress: {
            eFactor: 2.5,
            interval: 0,
            intervalBeforeLearning: 0,
            phase: "learning" as const,
            nextRepetition: 1
          },
        },
        ...state.learn.items.slice(1),
      ];

      const { wrapper } = TestingContainer(undefined, { learn: { ...state.learn, items }});
      render(<LearnDailyList />, { wrapper });

      expect(screen.getAllByText('1 minute')[0]).toBeInTheDocument();
    })

    it(`should display the next repetition as minutes`, () => {
      const items = [
        {
          ...state.learn.items[0],
          progress: {
            eFactor: 2.5,
            interval: 1,
            intervalBeforeLearning: 0,
            phase: "learning" as const,
            nextRepetition: 1
          },
        },
        ...state.learn.items.slice(1),
      ];

      const { wrapper } = TestingContainer(undefined, { learn: { ...state.learn, items }});
      render(<LearnDailyList />, { wrapper });

      expect(screen.getAllByText('10 minutes')[0]).toBeInTheDocument();
    })

    it(`should display the next repetition as hours`, () => {
      const items = [
        {
          ...state.learn.items[0],
          progress: {
            eFactor: 2.5,
            interval: 120,
            intervalBeforeLearning: 0,
            phase: "graduated" as const,
            nextRepetition: 1
          },
        },
        ...state.learn.items.slice(1),
      ];

      const { wrapper } = TestingContainer(undefined, { learn: { ...state.learn, items }});
      render(<LearnDailyList />, { wrapper });

      expect(screen.getAllByText('5 hours')[0]).toBeInTheDocument();
    })

    it(`should display the next repetition as days`, () => {
      const items = [
        {
          ...state.learn.items[0],
          progress: {
            eFactor: 2.5,
            interval: 10,
            intervalBeforeLearning: 0,
            phase: "learning" as const,
            nextRepetition: 1
          },
        },
        ...state.learn.items.slice(1),
      ];

      const { wrapper } = TestingContainer(undefined, { learn: { ...state.learn, items }});
      render(<LearnDailyList />, { wrapper });

      expect(screen.getAllByText('1 day')[0]).toBeInTheDocument();
    })
    
  });
})