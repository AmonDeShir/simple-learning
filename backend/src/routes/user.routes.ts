import { Router } from "express"
import { UserController } from "../controllers/user.controller";
import { authenticationGuard } from "../middlewares/auth-guard.middleware";

export const UserRoutes = () => {
  const api = Router();

  api.post(
    '/save-word',
    authenticationGuard,
    UserController.addWord
  );

  return api;
}