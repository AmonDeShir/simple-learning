import { Router } from "express"
import { WordController } from "../controllers/word.controller";
import { authenticationGuard } from "../middlewares/auth-guard.middleware";

export const WordRoutes = () => {
  const api = Router();

  api.get(
    '/search/:word',
    authenticationGuard,
    WordController.search
  );

  api.get(
    '/daily-list',
    authenticationGuard,
    WordController.getDailyList
  );

  api.get(
    '/month-list/:month',
    authenticationGuard,
    WordController.getMonthList
  );

  api.put(
    '/daily-list/',
    authenticationGuard,
    WordController.updateLearningProgress
  );

  return api;
}