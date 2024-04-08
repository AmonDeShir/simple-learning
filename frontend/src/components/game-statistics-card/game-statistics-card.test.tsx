import { render, screen } from "@testing-library/react";
import { GameStatisticsCard } from "./game-statistics-card";

const corrects = [
  { title: 'correct 1', value: 'value 1', id: '1' },
  { title: 'correct 2', value: 'value 2', id: '2' },
  { title: 'correct 3', value: 'value 3', id: '3' },
  { title: 'correct 4', value: 'value 4', id: '4' },

];

const wrongs = [
  { title: 'wrong 1', value: 'value 5', id: '5' },
  { title: 'wrong 2', value: 'value 6', id: '6' },
];

describe('GameStatisticsCard', () => {
  it(`should calc the percent of the corrects answers`, () => {
    render(<GameStatisticsCard corrects={corrects} wrongs={wrongs} all={6} />);

    expect(screen.getByText('66%')).toBeInTheDocument();
  });

  it(`should set the percent of the corrects answer to the 100% if there is no answers`, () => {
    render(<GameStatisticsCard corrects={[]} wrongs={[]} all={0} />);

    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it(`should show the answers`, () => {
    render(<GameStatisticsCard corrects={corrects} wrongs={wrongs} all={6} />);

    expect(screen.getByText('correct 1')).toBeInTheDocument();
    expect(screen.getByText('correct 2')).toBeInTheDocument();
    expect(screen.getByText('correct 3')).toBeInTheDocument();
    expect(screen.getByText('correct 4')).toBeInTheDocument();
    expect(screen.getByText('wrong 1')).toBeInTheDocument();
    expect(screen.getByText('wrong 2')).toBeInTheDocument();
  });

  it(`should hide the Corrects title if there is no correct answers`, () => {
    render(<GameStatisticsCard corrects={[]} wrongs={wrongs} all={2} />);

    expect(screen.queryByText('Corrects')).not.toBeInTheDocument();
  });

  it(`should hide the Wrongs title if there is no wrong answers`, () => {
    render(<GameStatisticsCard corrects={corrects} wrongs={[]} all={4} />);

    expect(screen.queryByText('Wrongs')).not.toBeInTheDocument();
  });
});
