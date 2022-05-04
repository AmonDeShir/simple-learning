import { capitalize, ThemeProvider } from "@mui/material";
import { configureStore } from "@reduxjs/toolkit";
import Navigation, { Route, useOpenPage, useNavigationArgument } from "animated-router-react";
import React, { FormEventHandler, PropsWithChildren, useEffect } from "react";
import { Provider } from "react-redux";
import { userReducer } from "../../redux/slices/users/user";
import { theme } from "../../theme";

const OpenTestPage = (props: { argument?: string }) => {
  const navigate = useOpenPage();
  
  useEffect(() => {
    navigate('/test', { updateHistory: false, argument: props.argument });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>
}

const Page = (props: { path: string }) => {
  const args = useNavigationArgument();
  const text = capitalize(props.path.replace('/', '').replaceAll('-', ' '));


  return (
    <Route 
      path={props.path} 
      component={
        <div>
          <p>{text} page</p>
          <p>{args}</p>
        </div>
      }
    />
  )
};

export const FormMock = ({ onSubmit, children }: PropsWithChildren<{onSubmit?: (data: any) => void}>) => {
  const handleFormSubmit: FormEventHandler = (e) => {
    if (e.target instanceof HTMLFormElement) {
      // Make sure prevented events don't fire the "onSubmit" method
      if (!e.defaultPrevented) {
        onSubmit?.({
          method: e.target.method,
          action: e.target.action,
          target: e.target.target,
          data: Object.fromEntries(new FormData(e.target)),
        });
      }

      e.preventDefault();
    }
  };

  return <div onSubmit={handleFormSubmit}>{children}</div>;
};

export const TestingContainer = (navigationArgument = '') => {
  const reduxActions: any = {};
  const submitSpy = jest.fn();

  const saveAction = (container: any) => (action: any) => { container[action.type] = action; return {} };

  const store = configureStore({
    reducer: {
      user: userReducer,
      saveActions: (_, action) => saveAction(reduxActions)(action),
    },
  })

  return {
    reduxActions,
    submitSpy,
    wrapper: ({ children }: React.PropsWithChildren<{}>) => (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Navigation>
            <Page path="/log-in" />
            <Page path="/register" />
            <Page path="/email-authentication" />
            <Page path="/authenticate-your-email" />
            <Page path="/send-email" />
            <Page path="/receive-email" />
            <Page path="/reset-password" />
            <Page path="/reset-password-message" />
            <Page path="/404" />    
            
            <Route path="/test" component={<div><FormMock onSubmit={submitSpy}>{children}</FormMock></div>} />
            <Route path="/" component={<div>Main Page</div>} />   
            <OpenTestPage argument={navigationArgument} />
          </Navigation>
        </ThemeProvider>
      </Provider>
    )
  }
}