import { Response } from "express";
import { SetDao } from "../models/set.model";
import { UsersDao } from "../models/user.model";
import { WordDao } from "../models/word.model";
import { AuthenticatedRequest } from "../middlewares/auth-guard.middleware";
import { WordConstructor } from "../types/word.type";

export namespace UserController {
  export async function addWord(req: AuthenticatedRequest<{}, { word: string | WordConstructor }>, res: Response) {
    const { user, word } = req.body;

    try {
      await UsersDao.addWord(user, word);
    }
    catch {
      return res.status(400).json({
        status: 400,
        message: 'Word not saved'
      });
    }

    return res.status(200).json({
      status: 200,
      message: 'success'
    })
  }
}