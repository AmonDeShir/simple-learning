import { render, screen } from "@testing-library/react";
import { Loader } from "./loader";

describe('Loader', () => {
  it(`should render a text that informs about loading`, () => {
    render(<Loader />);

    expect(screen.getByText('Loading please wait...')).toBeInTheDocument();
  })

  it(`should display a loading icon`, () => {
    render(<Loader />);

    expect(screen.getByTestId('loading-icon-default')).toBeInTheDocument();
  });
});