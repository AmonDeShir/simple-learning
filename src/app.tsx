
import Main from './pages/app/main/main';
import SetList from './pages/app/set-list/set-list';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAppSelector } from './redux/store';
import { Authentication } from './pages/authentication/authentication';
import { EditSet } from './pages/app/set/edit-set/edit-set';
import { Dictionary } from './pages/app/dictionary/dictionary';
import { NewWord } from './pages/app/set/new-word/new-word';
import { ViewSet } from './pages/app/set/view-set/view-set';
import { Game } from './pages/app/games/game';
import { ShowDailyList } from './pages/app/daily-list/show-daily-list/show-daily-list';

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
    </BrowserRouter>
  );
} 