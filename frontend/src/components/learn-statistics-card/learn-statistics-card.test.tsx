import { fireEvent, render, screen } from "@testing-library/react";
import { LearnItem } from "../../redux/slices/learn/learn.types";
import { LearnStatisticsCard } from "./learn-statistics-card";

const items: LearnItem[] = [
  {
    id: '0_1',
    set: 'set_id_0',
    inGameId: '0_1--0',
    text: 'item 1',
    translation: 'translation 1',
    invert: false,
    mode: 'flashcard',
    progress: {
      eFactor: 2.5,
      interval: 0,
      intervalBeforeLearning: 0,
      phase: "learning",
      nextRepetition: 1
    },
  },
  {
    id: '0_2',
    set: 'set_id_0',
    inGameId: '0_2--0',
    wordId: '0_1',
    text: 'item 2',
    translation: 'translation 2',
    invert: false,
    mode: 'writing',
    progress: {
      eFactor: 2.5,
      interval: 0,
      intervalBeforeLearning: 0,
      phase: "learning",
      nextRepetition: 1
    },
  },
  {
    id: '0_3',
    set: 'set_id_0',
    inGameId: '0_3--0',
    wordId: '0_1',
    text: 'item 3',
    translation: 'translation 3',
    invert: false,
    mode: 'writing',
    progress: {
      eFactor: 2.5,
      interval: 0,
      intervalBeforeLearning: 0,
      phase: "learning",
      nextRepetition: 1
    },
  },
],

answers = [
  {
    item: '0_1',
    values: [0.9, 0.8, 0.7],
    nextRepetition: 1651774590727
  },
  {
    item: '0_2',
    values: [0.5, 0.5, 1, 1, 1],
    nextRepetition: 1651860990727
  },
  {
    item: '0_3',
    values: [0, 1],
    nextRepetition: 1651947390727
  }
]

describe('LearnStatisticsCard', () => {
  it(`should show the answers`, () => {
    render(<LearnStatisticsCard items={items} answers={answers}/>);

    expect(screen.getByText('item 1')).toBeInTheDocument();
    expect(screen.getByText('translation 1')).toBeInTheDocument();
    expect(screen.getByText('05/05/2022')).toBeInTheDocument();
    expect(screen.getByText('90%, 80%, 70%')).toBeInTheDocument();


    expect(screen.getByText('item 2')).toBeInTheDocument();
    expect(screen.getByText('translation 2')).toBeInTheDocument();
    expect(screen.getByText('05/06/2022')).toBeInTheDocument();
    expect(screen.getByText('50%, 50%, 100%, 100%, 100%')).toBeInTheDocument();

    expect(screen.getByText('item 3')).toBeInTheDocument();
    expect(screen.getByText('translation 3')).toBeInTheDocument();
    expect(screen.getByText('05/07/2022')).toBeInTheDocument();
    expect(screen.getByText('0%, 100%')).toBeInTheDocument();
  });

  it(`should show the tooltips`, async () => {
    render(<LearnStatisticsCard items={items} answers={answers}/>);

    fireEvent.mouseOver(screen.getByText('item 1'));
    
    await screen.findByRole('tooltip');
    expect(screen.getByText('Text')).toBeInTheDocument();
    
    fireEvent.mouseLeave(screen.getByText('item 1'));
    fireEvent.mouseOver(screen.getByText('translation 1'));
    
    await screen.findByRole('tooltip');
    expect(screen.getByText('Translation')).toBeInTheDocument();
    
    fireEvent.mouseLeave(screen.getByText('translation 1'));
    fireEvent.mouseOver(screen.getByText('05/05/2022'));
    
    await screen.findByRole('tooltip');
    expect(screen.getByText('Next repetition')).toBeInTheDocument();
    
    fireEvent.mouseLeave(screen.getByText('05/05/2022'));
    fireEvent.mouseOver(screen.getByText('90%, 80%, 70%'));
    
    await screen.findByRole('tooltip');
    expect(screen.getByText('Answers')).toBeInTheDocument();
  });

  it(`shouldn't show the answer if the answer's item not exist in the items array`, async () => {
    render(
      <LearnStatisticsCard 
        items={items} 
        answers={[
          ...answers,   
          {
            item: '0_4',
            values: [0],
            nextRepetition: 1652033790727
          }
        ]}
      />
    );

    expect(screen.queryByText('item 4')).not.toBeInTheDocument();
    expect(screen.queryByText('translation 4')).not.toBeInTheDocument();
    expect(screen.queryByText('05/08/2022')).not.toBeInTheDocument();
    expect(screen.queryByText('0%')).not.toBeInTheDocument();
  });
});
