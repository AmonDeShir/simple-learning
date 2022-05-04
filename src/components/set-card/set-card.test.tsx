import { render, screen } from "@testing-library/react";
import { SetCard } from "./set-card";

describe(`SetCard`, () => {
  it(`should render the small version`, () => {
    render(
      <SetCard 
        title="title"
        small
        progress={{ graduated: 5, learning: 20, relearning: 30 }}
        data={[
          { id: "1", word: "word 1", meaning: "meaning 1" },
          { id: "2", word: "word 2", meaning: "meaning 2" },
          { id: "3", word: "word 3", meaning: "meaning 3" },
        ]}
      />
    );

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('Learning: 20')).toBeInTheDocument();
    expect(screen.getByText('Relearning: 30')).toBeInTheDocument();
    expect(screen.getByText('Graduated: 5')).toBeInTheDocument();

    expect(screen.queryByText('word 1')).not.toBeInTheDocument();
    expect(screen.queryByText('word 2')).not.toBeInTheDocument();
    expect(screen.queryByText('word 3')).not.toBeInTheDocument();

    expect(screen.queryByText('meaning 1')).not.toBeInTheDocument();
    expect(screen.queryByText('meaning 2')).not.toBeInTheDocument();
    expect(screen.queryByText('meaning 3')).not.toBeInTheDocument();
  });

  it(`should render the full version`, () => {
    render(
      <SetCard 
        title="title"
        progress={{ graduated: 5, learning: 20, relearning: 30 }}
        data={[
          { id: "1", word: "word 1", meaning: "meaning 1" },
          { id: "2", word: "word 2", meaning: "meaning 2" },
          { id: "3", word: "word 3", meaning: "meaning 3" },
        ]}
      />
    );

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('Learning: 20')).toBeInTheDocument();
    expect(screen.getByText('Relearning: 30')).toBeInTheDocument();
    expect(screen.getByText('Graduated: 5')).toBeInTheDocument();

    expect(screen.getByText('word 1')).toBeInTheDocument();
    expect(screen.getByText('word 2')).toBeInTheDocument();
    expect(screen.getByText('word 3')).toBeInTheDocument();

    expect(screen.getByText('meaning 1')).toBeInTheDocument();
    expect(screen.getByText('meaning 2')).toBeInTheDocument();
    expect(screen.getByText('meaning 3')).toBeInTheDocument();
  });

  it(`should render icons`, () => {
    render(
      <SetCard 
        title="title"
        icons={[
          <div key="1">icon 1</div>,
          <div key="2">icon 2</div>,
        ]}
      />
    );

    expect(screen.getByText('icon 1')).toBeInTheDocument();
    expect(screen.getByText('icon 2')).toBeInTheDocument();
  });

  it(`should render the full version with limit`, () => {
    render(
      <SetCard 
        title="title"
        limit={2}
        data={[
          { id: "1", word: "word 1", meaning: "meaning 1" },
          { id: "2", word: "word 2", meaning: "meaning 2" },
          { id: "3", word: "word 3", meaning: "meaning 3" },
        ]}
      />
    );

    expect(screen.getByText('word 1')).toBeInTheDocument();
    expect(screen.getByText('word 2')).toBeInTheDocument();
    expect(screen.queryByText('word 3')).not.toBeInTheDocument();

    expect(screen.getByText('meaning 1')).toBeInTheDocument();
    expect(screen.getByText('meaning 2')).toBeInTheDocument();
    expect(screen.queryByText('meaning 3')).not.toBeInTheDocument();
  });
})