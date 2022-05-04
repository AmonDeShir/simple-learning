import { act, render, screen } from "@testing-library/react";
import { TestingContainer } from "../../utils/test-utils/testing-container";
import { SlideUpdate } from "./slide-update";

describe('SlideUpdate', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it(`should render the children`, () => {
    const { wrapper } = TestingContainer();
    render(<SlideUpdate id="1">Hello</SlideUpdate>, { wrapper });

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it(`should replace the old component with the new one`, () => {
    const { wrapper } = TestingContainer();
    const { rerender } = render(<SlideUpdate id="1">Hello</SlideUpdate>, { wrapper });
  
    rerender(<SlideUpdate id="2">World</SlideUpdate>);

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.queryByText('World')).not.toBeInTheDocument();

    act(() => {jest.advanceTimersByTime(510)});

    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
    expect(screen.getByText('World')).toBeInTheDocument();
  });

  it(`should not render the new children if the id is the same`, () => {
    const { wrapper } = TestingContainer();
    const { rerender } = render(<SlideUpdate id="1">Hello</SlideUpdate>, { wrapper });
    
    rerender(<SlideUpdate id="1">World</SlideUpdate>);
    act(() => {jest.advanceTimersByTime(510)});

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});