import { Router } from "express"
import { AuthController } from "../controllers/auth.controller";
import { authenticationGuard } from "../middlewares/auth-guard.middleware";
import { validate } from "../middlewares/validation.middleware";

export const AuthRoutes = () => {
  const api = Router();

  api.post(
    '/use-no-sync',
    AuthController.useNoSync
  );

  api.post(
    '/register',
    validate('email').isEmail,
    validate('password').isPassword,
    validate('name').isNotEmpty,
    AuthController.register
  );

  api.post(
    '/log-in',
    validate('email').isNotEmpty,
    validate('password').isNotEmpty,
    AuthController.logIn
  );

  api.post(
    '/log-out',
    authenticationGuard,
    AuthController.logOut
  );

  api.post(
    '/refresh',
    AuthController.refresh
  );

  api.post(
    '/send-password-reset-email',
    validate('email').isEmail,
    AuthController.sendPasswordResetEmail
  );

  api.post(
    '/reset-password',
    validate('token').isNotEmpty,
    validate('password').isPassword,
    AuthController.resetPassword
  );

  api.post(
    '/confirm-account',
    validate('token').isNotEmpty,
    AuthController.confirmAccount
  );

  return api;
}
