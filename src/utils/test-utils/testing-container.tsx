import { capitalize, createTheme, ThemeProvider } from "@mui/material";
import { configureStore } from "@reduxjs/toolkit";
import { FormEventHandler, PropsWithChildren, useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { editSetReducer } from "../../redux/slices/edit-set/edit-set";
import { gameReducer } from "../../redux/slices/game/game";
import { userReducer } from "../../redux/slices/users/user";
import { RootState } from "../../redux/store"
import { themeConstructor } from "../../theme";

const testTheme = createTheme({
  ...themeConstructor,
  transitions: { create: () => 'none' }
});

const OpenTestPage = (props: { argument?: { [key: string]: string } }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (props.argument) {
      navigate(`/test/${Object.values(props.argument).join('/')}`);
    }
    else {
      navigate('/test');
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>
}


const Page = ({path}: { path: string }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const args = useParams();
  const text = capitalize(path.split('/:')[0].replace('/', '').replaceAll('-', ' '));

  return (
    <div>
      <p>{text} page</p>
      <p>{Object.values(args).join(" - ")}</p>
    </div>
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


export const TestingContainer = (navigation?: { [key: string]: string }, state?: Partial<RootState>) => {
  const reduxActions: any = {};
  const submitSpy = jest.fn();

  const saveAction = (container: any) => (action: any) => { container[action.type] = action; return {} };

  const store = configureStore({
    reducer: {
      user: userReducer,
      editSet: editSetReducer,
      game: gameReducer,
      saveActions: (_, action) => saveAction(reduxActions)(action),
    },
    preloadedState: {
      ...state,
    }
  });

  return {
    reduxActions,
    reduxStore: store,
    submitSpy,
    wrapper: ({ children }: React.PropsWithChildren<{}>) => {
      const args = navigation ? Object.keys(navigation).map(item => `/:${item}`).join('') : '';
      
      return (
        <Provider store={store}>
          <ThemeProvider theme={testTheme}>
            <BrowserRouter>
              <Routes>
                <Route 
                  path="/dictionary/:word"
                  element={<Page path={"/dictionary/:word"} />}
                />
                <Route 
                  path="/set/:setId"
                  element={<Page path={"/set/:setId"} />}
                />

                <Route 
                  path="/set-list"
                  element={<Page path={"/set-list"} />}
                />

                <Route 
                  path="/edit-set"
                  element={<Page path={"/edit-set"} />}
                />

                <Route 
                  path="/new-word"
                  element={<Page path={"/new-word"} />}
                />

                <Route 
                  path="/game/:mode/:setId"
                  element={<Page path={"/game/:mode/:setId"} />}
                />

                <Route path={`/test${args}`} element={<div><FormMock onSubmit={submitSpy}>{children}</FormMock></div>} />
                <Route path="/" element={<div>Main Page</div>} />   
              </Routes>

              <OpenTestPage argument={navigation} />
            </BrowserRouter>
          </ThemeProvider>
        </Provider>
      )
    }
  }
}
