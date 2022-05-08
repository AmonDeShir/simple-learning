import { act, fireEvent, render, screen } from "@testing-library/react";
import { UserMenu } from "./user-menu";
import * as Animations from "./user-menu.animations";

describe('UserMenu', () => {
  let showSpy: jest.SpyInstance;
  let hideSpy: jest.SpyInstance;

  beforeAll(() => {
    showSpy = jest.spyOn(Animations, 'showAnimation');
    hideSpy = jest.spyOn(Animations, 'hideAnimation');
    jest.useFakeTimers();
  });

  beforeEach(() => {
    showSpy.mockClear();
    showSpy.mockImplementation((_, onDone: any) => { setTimeout(onDone, 100); });

    hideSpy.mockClear();
    hideSpy.mockImplementation((_, onDone: any) => { setTimeout(onDone, 100); });
  });

  afterAll(() => {
    showSpy.mockRestore();
    hideSpy.mockRestore();
    jest.useRealTimers();
  });

  it(`should display the user's initials`, () => {
    render(<UserMenu user="John Doe" item="Test" />);

    expect(screen.getByText("JD")).toBeInTheDocument();
  })
  
  it(`should capitalize the user's initials`, () => {
    render(<UserMenu user="john doe" item="Test" />);

    expect(screen.getByText("JD")).toBeInTheDocument();
  })

  it(`should display a text from the item property`, () => {
    render(<UserMenu user="John Doe" item="Test" />);

    expect(screen.getByText("Test")).toBeInTheDocument();
  })

  it(`should call the onItemClick property if the item is clicked`, () => {
    const onItemClick = jest.fn();

    render(<UserMenu user="John Doe" item="Test" onItemClick={onItemClick} />);

    fireEvent.click(screen.getByText("Test"));

    expect(onItemClick).toHaveBeenCalled();
  });

  it(`should play the showAnimation if the avatar is clicked`, () => {
    render(<UserMenu user="John Doe" item="Test" />);
    
    fireEvent.click(screen.getByText("JD"));
    act(() => { jest.advanceTimersByTime(100) });

    expect(showSpy).toBeCalledTimes(1);
  });

  it(`should play the showAnimation only once if the avatar is clicked multiple times before the animation ends`, () => {
    render(<UserMenu user="John Doe" item="Test" />);
    
    fireEvent.click(screen.getByText("JD"));
    fireEvent.click(screen.getByText("JD"));
    fireEvent.click(screen.getByText("JD"));
    
    act(() => { jest.advanceTimersByTime(100) });

    expect(showSpy).toBeCalledTimes(1);
  });

  it(`should play the hideAnimation if the avatar is clicked second time`, () => {
    render(<UserMenu user="John Doe" item="Test" />);
    
    fireEvent.click(screen.getByText("JD"));
    act(() => { jest.advanceTimersByTime(100) });

    fireEvent.click(screen.getByText("JD"));
    act(() => { jest.advanceTimersByTime(100) });

    expect(showSpy).toBeCalledTimes(1);
    expect(hideSpy).toBeCalledTimes(1);
  });
})