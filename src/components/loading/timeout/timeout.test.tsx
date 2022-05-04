import { act, render } from "@testing-library/react";
import { Timeout } from "./timeout";

describe('Timeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it(`should display information about a bad internet connection if the time from the time property has elapsed`, () => {
    render(<Timeout time={1000} />);
    
    act(() => {jest.advanceTimersByTime(1000) });

    expect(document.body.textContent).toContain('Loading takes more time than usual, please check your internet connection');
  });

  it(`shouldn't display information about a bad internet connection if the time from the time property hasn't elapsed`, () => {
    render(<Timeout time={1000} />);
    
    act(() => {jest.advanceTimersByTime(500) });

    expect(document.body.textContent).not.toContain('Loading takes more time than usual, please check your internet connection');
  });
});