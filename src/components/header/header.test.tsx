import * as Animations from "./header.animations";
import * as ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen } from "@testing-library/react";
import { Header } from "./header";
import mediaQuery from 'css-mediaquery';
import { mockIcon, MockIcon } from "../../utils/mocks/icon-mock";
import { TestingContainer } from "../../utils/test-utils/testing-container";
import { PropsWithChildren, useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

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
    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', sync: false }})
    render(<Header title="Hello World" />, { wrapper });

    expect(screen.getByText("Hello World")).toBeInTheDocument();
  })

  it(`should render the back button`, () => {
    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', sync: false }})
    render(<Header title="Hello World" />, { wrapper });

    expect(screen.getByText("Back Icon")).toBeInTheDocument();
  });

  it(`shouldn't render the back button if the root page is open`, () => {
    const store = configureStore({ reducer: {
      user: () => ({
        name: 'Test User',
      })
    }});
    
    const OpenMainPage = () => {
      const navigate = useNavigate();

      useEffect(() => {
        navigate('/');
      }, [navigate]);

      return <></>;
    }

    const wrapper = ({ children }: PropsWithChildren<{}>) => (
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route
              index={true} 
              element={<div>{children}</div>}
            />

            <Route
              path="/test" 
              element={<div>DDD</div>}
            />
          </Routes>

          <OpenMainPage />
        </BrowserRouter>
      </Provider>
    );

    render(<Header title="Hello World" />, { wrapper });

    expect(screen.getByText("Hello World")).toBeInTheDocument();
    expect(screen.queryByText("Back Icon")).not.toBeInTheDocument();
  });

  it(`should open previous page if the back button was clicked`, () => {
    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', sync: false }})
    render(<Header title="Hello World" />, { wrapper });

    const backButton = screen.getByText("Back Icon");
    backButton.click();

    expect(historyBackSpy).toHaveBeenCalledTimes(1);
  });

  it(`should render the user menu`, () => {
    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', sync: false }})
    render(<Header title="Hello World" />, { wrapper });

    expect(screen.getByText("TU")).toBeInTheDocument();
  });

  it(`should display the 'Register' text as the user menu's item if the application is used in no-sync mode`, () => {
    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', sync: false }})
    render(<Header title="Hello World" />, { wrapper });

    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  it(`should display the 'Log out' text as the user menu's item if the application is used in sync mode`, () => {
    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', sync: true }})
    render(<Header title="Hello World" />, { wrapper });

    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  it(`shouldn't play animations if the scroll operation was too small to reach the anchor value`, () => {
    window.matchMedia = createMatchMedia(500) as any;
    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', sync: false }})
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

  it(`should navigate to the 'register' page if the 'Register' text is clicked`, () => {
    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', sync: false }})
    render(<Header title="Hello World" />, { wrapper });
    expect(screen.getByText("TU")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Register"));

    expect(screen.getByText('Auth page')).toBeInTheDocument();
    expect(screen.getByText('register')).toBeInTheDocument();
  });

  it(`should do a log-out request and dispatch the openLoginPage action if the 'Log out' text is clicked`, () => {
    axiosPostSpy.mockResolvedValue({
      status: 200,
      message: 'success'
    });

    const { wrapper } = TestingContainer(undefined, { user: { name: 'Test User', sync: true }})
    render(<Header title="Hello World" />, { wrapper });

    fireEvent.click(screen.getByText("Log out"));

    expect(axiosPostSpy).toHaveBeenCalledWith('/api/v1/auth/log-out', {}, expect.any(Object));
    expect(screen.getByText('Auth page')).toBeInTheDocument();
  });

    describe('refresh request', () => {
      it(`should do the refresh request if the state's name is undefined`, async () => {
        axiosPostSpy.mockResolvedValue({
          status: 200,
          data: {
            status: 200,
            data: {
              name: 'Test User',
              sync: true
            }
          }
        });
    
        const { wrapper } = TestingContainer(undefined, { user: { name: undefined, sync: false }})
        render(<Header title="Hello World" />, { wrapper });
    
        await screen.findByText('Log out');
    
        expect(axiosPostSpy).toHaveBeenCalledWith('/api/v1/auth/refresh', {}, expect.any(Object));
        expect(screen.getByText("TU")).toBeInTheDocument();
      })

      it(`should open the '/auth' page if the refresh request failed`, async () => {
        axiosPostSpy.mockRejectedValue({
          status: 404,
          message: 'not found'
        });
    
        const { wrapper } = TestingContainer(undefined, { user: { name: undefined, sync: false }})
        render(<Header title="Hello World" />, { wrapper });
    
        await screen.findByText('Auth page');
    
        expect(axiosPostSpy).toHaveBeenCalledWith('/api/v1/auth/refresh', {}, expect.any(Object));
        expect(screen.getByText("Auth page")).toBeInTheDocument();
      })
    })
})