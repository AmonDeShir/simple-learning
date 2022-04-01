import { MuiThemeProvider } from "@material-ui/core";
import { configureStore } from "@reduxjs/toolkit";
import { NavigationContext } from "animated-router-react";
import React from "react";
import { Provider } from "react-redux";
import userReducer from "../../redux/slices/users/user";
import { theme } from "../../theme";

const DefaultNavigationState = {
  routes: new Map(),
  selected: null,
  selectPath: window.location.pathname,
  initPath: window.location.pathname,
  previousPath: null,
  argument: '',
};

export const TestingContainer = (navigationArgument = '') => {
  const reduxActions: any = {};
  const navigationActions: any = {};

  const saveAction = (container: any) => (action: any) => { container[action.type] = action; return {} };

  const navigationStore = {
    ...DefaultNavigationState,
    argument: navigationArgument ?? '',
  }

  const store = configureStore({
    reducer: {
      user: userReducer,
      saveActions: (_, action) => saveAction(reduxActions)(action),
    },
  })

  return {
    reduxActions,
    navigationActions,
    wrapper: ({ children }: React.PropsWithChildren<{}>) => (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <NavigationContext.Provider value={{ dispatch: saveAction(navigationActions), state: navigationStore }}>
            {children}
          </NavigationContext.Provider>
        </MuiThemeProvider>
      </Provider>
    )
  }
}