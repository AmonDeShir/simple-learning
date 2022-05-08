import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen } from "@testing-library/react";
import * as ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as Animations from "./header.animations";
import { Header } from "./header";
import mediaQuery from 'css-mediaquery';
import { mockIcon, MockIcon } from "../../utils/mocks/icon-mock";
import "jest-location-mock";
import { TestingContainer } from "../../utils/test-utils/testing-container";
import { PropsWithChildren } from "react";

function createMatchMedia(width: number) {
  return (query: any) => ({
    matches: mediaQuery.match(query, {
      width,
    }),
    addListener: () => {},
    removeListener: () => {},
  });
}

describe('Header', () => {
  let backIcon: MockIcon;
  let historyBackSpy: jest.SpyInstance;
  let enterFullscreenModeSpy: jest.SpyInstance;
  let exitFullscreenModeSpy: jest.SpyInstance;

  beforeAll(() => {
    backIcon = mockIcon(ArrowBackIcon, "Back Icon");
    historyBackSpy = jest.spyOn(window.history, 'back');
    enterFullscreenModeSpy = jest.spyOn(Animations, 'enterFullscreenMode');
    exitFullscreenModeSpy = jest.spyOn(Animations, 'exitFullscreenMode');
    window.location.pathname = '/test';
  });

  beforeEach(() => {
    historyBackSpy.mockClear();
    enterFullscreenModeSpy.mockClear();
    exitFullscreenModeSpy.mockClear();
    window.matchMedia = createMatchMedia(window.innerWidth) as any;
  });

  afterAll(() => {
    backIcon.mockRestore();
    historyBackSpy.mockRestore();
    enterFullscreenModeSpy.mockRestore();
    exitFullscreenModeSpy.mockRestore();
  });

  it(`should render the title`, () => {
    window.location.pathname = '/test';

    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', loginPage: false, sync: false }})
    render(<Header title="Hello World" />, { wrapper });

    expect(screen.getByText("Hello World")).toBeInTheDocument();
  })

  it(`should render the back button`, () => {
    window.location.pathname = '/test';

    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', loginPage: false, sync: false }})
    render(<Header title="Hello World" />, { wrapper });

    expect(screen.getByText("Back Icon")).toBeInTheDocument();
  });

  it(`shouldn't render the back button if the root page is open`, () => {
    window.location.pathname = '/';

    const store = configureStore({ reducer: {
      user: () => ({
        name: 'Test User',
      })
    }});
    
    const wrapper = ({ children }: PropsWithChildren<{}>) => (
      <Provider store={store}>
        {children}
      </Provider>
    );

    render(<Header title="Hello World" />, { wrapper });

    expect(screen.queryByText("Back Icon")).not.toBeInTheDocument();
  });

  it(`should render the user menu`, () => {
    window.location.pathname = '/test';

    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', loginPage: false, sync: false }})
    render(<Header title="Hello World" />, { wrapper });

    expect(screen.getByText("TU")).toBeInTheDocument();
  });

  it(`should open previous page if the back button was clicked`, () => {
    window.location.pathname = '/test';

    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', loginPage: false, sync: false }})
    render(<Header title="Hello World" />, { wrapper });

    const backButton = screen.getByText("Back Icon");
    backButton.click();

    expect(historyBackSpy).toHaveBeenCalledTimes(1);
  });

  it(`should go into fullscreen mode if the page is scrolled beyond the background`, () => {
    window.location.pathname = '/test';
    window.matchMedia = createMatchMedia(2000) as any;
    
    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', loginPage: false, sync: false }})
    render(<Header title="Hello World" />, { wrapper });

    fireEvent.scroll(window, { target: { scrollY: 500 } });

    expect(enterFullscreenModeSpy).toHaveBeenCalledTimes(1);
  });

  it(`should exit fullscreen mode if the page is scrolled back to the background`, () => {
    window.location.pathname = '/test';
    window.matchMedia = createMatchMedia(2000) as any;
    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', loginPage: false, sync: false }})
    render(<Header title="Hello World" />, { wrapper });


    expect(enterFullscreenModeSpy).toHaveBeenCalledTimes(0);
    expect(exitFullscreenModeSpy).toHaveBeenCalledTimes(2);

    fireEvent.scroll(window, { target: { scrollY: 500 } });    
    fireEvent.scroll(window, { target: { scrollY: 0 } });

    expect(enterFullscreenModeSpy).toHaveBeenCalledTimes(1);
    expect(exitFullscreenModeSpy).toHaveBeenCalledTimes(3);
  });

  it(`shouldn't play animations if the scroll operation was too small to reach the anchor value`, () => {
    window.location.pathname = '/test';
    window.matchMedia = createMatchMedia(500) as any;
    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', loginPage: false, sync: false }})
    render(<Header title="Hello World" />, { wrapper });


    expect(enterFullscreenModeSpy).toHaveBeenCalledTimes(0);
    expect(exitFullscreenModeSpy).toHaveBeenCalledTimes(1);

    fireEvent.scroll(window, { target: { scrollY: 100 } });    

    expect(enterFullscreenModeSpy).toHaveBeenCalledTimes(0);
    expect(exitFullscreenModeSpy).toHaveBeenCalledTimes(1);

    fireEvent.scroll(window, { target: { scrollY: 500 } });    

    expect(enterFullscreenModeSpy).toHaveBeenCalledTimes(1);
    expect(exitFullscreenModeSpy).toHaveBeenCalledTimes(1);

    fireEvent.scroll(window, { target: { scrollY: 10000 } });    

    expect(enterFullscreenModeSpy).toHaveBeenCalledTimes(1);
    expect(exitFullscreenModeSpy).toHaveBeenCalledTimes(1);
  });
})