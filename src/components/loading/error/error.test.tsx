import { render, screen } from "@testing-library/react";
import { Error } from "./error";

describe('Error', () => {
  it(`should render a text from the message parameter`, () => {
    render(<Error message={'This is a message'} />);

    expect(screen.getByText('This is a message')).toBeInTheDocument();
  })
  it(`should display an error loading icon`, () => {
    render(<Error message={'This is a message'} />);

    expect(screen.getByTestId('loading-icon-error')).toBeInTheDocument();
  });
});