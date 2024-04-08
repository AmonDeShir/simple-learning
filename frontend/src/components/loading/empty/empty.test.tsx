import { render, screen } from "@testing-library/react";
import { Empty } from "./empty";

describe('Empty', () => {
  it(`should render a text from the message parameter`, () => {
    render(<Empty message={'This is a message'} />);

    expect(screen.getByText('This is a message')).toBeInTheDocument();
  });

  it(`should display an empty loading icon`, () => {
    render(<Empty message={'This is a message'} />);

    expect(screen.getByTestId('loading-icon-empty')).toBeInTheDocument();
  });
});