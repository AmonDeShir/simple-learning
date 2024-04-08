import { act, render, screen } from "@testing-library/react";
import { Loading } from "./loading"

describe('Loading', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it(`should display the loader if the state is 'loading'`, () => {
    render(<Loading state="loading" timeout={20000} message="" />);

    expect(screen.getByTestId('loading-icon-default')).toBeInTheDocument();
    expect(screen.getByText('Loading please wait...')).toBeInTheDocument();
  });

  it(`should display the empty if the state is 'empty'`, () => {
    render(<Loading state="empty" timeout={20000} message="Wow, such empty :(" />);

    expect(screen.getByTestId('loading-icon-empty')).toBeInTheDocument();
    expect(screen.getByText('Wow, such empty :(')).toBeInTheDocument();
  });

  it(`should display the error if the state is 'error'`, () => {
    render(<Loading state="error" timeout={20000} message="There was an error. Please try again" />);

    expect(screen.getByTestId('loading-icon-error')).toBeInTheDocument();
    expect(screen.getByText('There was an error. Please try again')).toBeInTheDocument();
  });

  it(`should display the children if the state is 'success'`, () => {
    render(<Loading state="success" timeout={20000} message=""><div>Hello</div></Loading>);

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
  
  it(`should display a timeout message if the state is 'loading' and the time from the timeout property has elapsed`, () => {
    render(<Loading state="loading" timeout={20000} message="" />);

    act(() => { jest.advanceTimersByTime(20000) });

    expect(screen.getByText('Loading takes more time than usual, please check your internet connection')).toBeInTheDocument();
    expect(screen.getByTestId('loading-icon-default')).toBeInTheDocument();
  });

  it(`should hide the timeout message if the state isn't 'loading' and the time from the timeout property has elapsed`, () => {
    const { rerender } = render(<Loading state="loading" timeout={20000} message="" />);

    act(() => { jest.advanceTimersByTime(20000) });

    expect(screen.getByText('Loading takes more time than usual, please check your internet connection')).toBeInTheDocument();

    rerender(<Loading state="success" timeout={20000} message="" />);
    expect(screen.queryByText('Loading takes more time than usual, please check your internet connection')).not.toBeInTheDocument();
  });
});