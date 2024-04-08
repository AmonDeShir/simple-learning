import { Router } from "express"
import { SetController } from "../controllers/set.controller";
import { authenticationGuard } from "../middlewares/auth-guard.middleware";

export const SetRoutes = () => {
  const api = Router();

  api.get(
    '/',
    authenticationGuard,
    SetController.list
  );

  api.get(
    '/search/:word',
    authenticationGuard,
    SetController.search
  )

  api.get(
    '/search',
    authenticationGuard,
    SetController.getAll
  )

  api.get(
    '/game/:id/:mode',
    authenticationGuard,
    SetController.game
  )

  api.get(
    '/progress',
    authenticationGuard,
    SetController.progress
  );

  api.post(
    '/',
    authenticationGuard,
    SetController.create
  );

  api.get(
    '/:id',
    authenticationGuard,
    SetController.findOne
  );

  api.delete(
    '/:id',
    authenticationGuard,
    SetController.remove
  )

  api.put(
    '/:id',
    authenticationGuard,
    SetController.update
  )

  return api;
}