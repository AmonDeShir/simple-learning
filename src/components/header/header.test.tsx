import * as Animations from "./header.animations";
import * as ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen } from "@testing-library/react";
import { Header } from "./header";
import mediaQuery from 'css-mediaquery';
import { mockIcon, MockIcon } from "../../utils/mocks/icon-mock";
import "jest-location-mock";
import { TestingContainer } from "../../utils/test-utils/testing-container";
import { PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";

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
  let axiosPostSpy: jest.SpyInstance;

  beforeAll(() => {
    backIcon = mockIcon(ArrowBackIcon, "Back Icon");
    historyBackSpy = jest.spyOn(window.history, 'back');
    enterFullscreenModeSpy = jest.spyOn(Animations, 'enterFullscreenMode');
    exitFullscreenModeSpy = jest.spyOn(Animations, 'exitFullscreenMode');
    window.location.pathname = '/test';
    axiosPostSpy = jest.spyOn(axios, 'post');
  });

  beforeEach(() => {
    historyBackSpy.mockClear();
    enterFullscreenModeSpy.mockClear();
    exitFullscreenModeSpy.mockClear();
    window.matchMedia = createMatchMedia(window.innerWidth) as any;
    axiosPostSpy.mockClear();
  });

  afterAll(() => {
    backIcon.mockRestore();
    historyBackSpy.mockRestore();
    enterFullscreenModeSpy.mockRestore();
    exitFullscreenModeSpy.mockRestore();
    axiosPostSpy.mockRestore();
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
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    );

    render(<Header title="Hello World" />, { wrapper });

    expect(screen.queryByText("Back Icon")).not.toBeInTheDocument();
  });

  it(`should open previous page if the back button was clicked`, () => {
    window.location.pathname = '/test';

    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', loginPage: false, sync: false }})
    render(<Header title="Hello World" />, { wrapper });

    const backButton = screen.getByText("Back Icon");
    backButton.click();

    expect(historyBackSpy).toHaveBeenCalledTimes(1);
  });

  it(`should render the user menu`, () => {
    window.location.pathname = '/test';

    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', loginPage: false, sync: false }})
    render(<Header title="Hello World" />, { wrapper });

    expect(screen.getByText("TU")).toBeInTheDocument();
  });

  it(`should display the 'Register' text as the user menu's item if the application is used in no-sync mode`, () => {
    window.location.pathname = '/test';

    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', loginPage: false, sync: false }})
    render(<Header title="Hello World" />, { wrapper });

    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  it(`should display the 'Log out' text as the user menu's item if the application is used in sync mode`, () => {
    window.location.pathname = '/test';

    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', loginPage: false, sync: true }})
    render(<Header title="Hello World" />, { wrapper });

    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  it(`should navigate to the 'register' page if the 'Register' text is clicked`, () => {
    window.location.pathname = '/test';

    const { wrapper, reduxActions } = TestingContainer(undefined, { user: { name: 'Test User', loginPage: false, sync: false }})
    render(<Header title="Hello World" />, { wrapper });

    fireEvent.click(screen.getByText("Register"));

    expect(reduxActions['user/openLoginPage']).toEqual({
      type: 'user/openLoginPage',
    });

    expect(window.location.pathname).toEqual('/register');
  });

  it(`should do a log-out request and dispatch the openLoginPage action if the 'Log out' text is clicked`, () => {
    window.location.pathname = '/test';
    axiosPostSpy.mockResolvedValue({
      status: 200,
      message: 'success'
    });

    const { wrapper, reduxActions } = TestingContainer(undefined, { user: { name: 'Test User', loginPage: false, sync: true }})
    render(<Header title="Hello World" />, { wrapper });

    fireEvent.click(screen.getByText("Log out"));

    expect(axiosPostSpy).toHaveBeenCalledWith('/api/v1/auth/log-out', {}, expect.any(Object));
    
    expect(reduxActions['user/openLoginPage']).toEqual({
      type: 'user/openLoginPage',
    });

    expect(window.location.pathname).toEqual('/');
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