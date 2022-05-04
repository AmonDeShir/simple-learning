import { render, screen } from '@testing-library/react';
import { LoadingIcon } from './loading-icon';

describe(`LoadingIcon`, () => {
  it(`should render the default loading icon`, () => {
    render(<LoadingIcon />);

    expect(screen.getByTestId(`loading-icon-default`)).toBeInTheDocument();
    expect(screen.queryByTestId(`loading-icon-empty`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`loading-icon-error`)).not.toBeInTheDocument();
  });

  it(`should render the empty loading icon`, () => {
    render(<LoadingIcon type="empty" />);

    expect(screen.getByTestId(`loading-icon-empty`)).toBeInTheDocument();
    expect(screen.queryByTestId(`loading-icon-default`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`loading-icon-error`)).not.toBeInTheDocument();
  });

  it(`should render the error loading icon`, () => {
    render(<LoadingIcon type="error" />);

    expect(screen.getByTestId(`loading-icon-error`)).toBeInTheDocument();
    expect(screen.queryByTestId(`loading-icon-default`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`loading-icon-empty`)).not.toBeInTheDocument();
  });
});