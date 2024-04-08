import { Router } from "express"
import { DictionaryController } from "../controllers/dictionary.controller";

export const DictionaryRoutes = () => {
  const api = Router();

  api.get(
    '/search/:word',
    DictionaryController.search
  );

  return api;
}