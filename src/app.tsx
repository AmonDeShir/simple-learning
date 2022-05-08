
import Main from './pages/app/main/main';
import SetList from './pages/app/set-list/set-list';
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from './redux/store';
import { Authentication } from './pages/authentication/authentication';
import { EditSet } from './pages/app/set/edit-set/edit-set';
import { Dictionary } from './pages/app/dictionary/dictionary';
import { NewWord } from './pages/app/set/new-word/new-word';
import { ViewSet } from './pages/app/set/view-set/view-set';
import { Game } from './pages/app/games/game';
import { ShowDailyList } from './pages/app/daily-list/show-daily-list/show-daily-list';
import { LearnDailyList } from './pages/app/daily-list/learn-daily-list/learn-daily-list';
import { useEffect } from 'react';
import { setPageBefore404 } from './redux/slices/users/user';

const OpenPageBefore404 = () => {
  const page = useAppSelector(({ user }) => user.pageBefore404);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (page !== undefined) {
      navigate(page);
      dispatch(setPageBefore404(undefined));
    }

  }, [navigate, page, dispatch]);
  
  return <></>
};

export const App = () => {
  const openLoginPage = useAppSelector(({ user }) => user.loginPage);

  return openLoginPage ? (
    <Authentication />
  ) : (
    <BrowserRouter>
      <Routes>
        <Route 
          path='/'
          element={<Main />}
        />

        <Route 
          path='/daily-list'
          element={<ShowDailyList />}
        />

        <Route 
          path='/daily-list/:page'
          element={<ShowDailyList />}
        />

        <Route 
          path='/learn'
          element={<LearnDailyList />}
        />

        <Route 
          path='/dictionary/:word'
          element={<Dictionary />}
        />

        <Route
          path='/set/:setId'
          element={<ViewSet />}
        />

        <Route
          path='/set-list'
          element={<SetList />}
        />

        <Route
          path='/edit-set'
          element={<EditSet />}
        />

        <Route
          path='/new-word'
          element={<NewWord />}
        />

        <Route
          path='/game/:mode/:setId'
          element={<Game />}
        />
      </Routes>

      <OpenPageBefore404 />
    </BrowserRouter>
  );
} 