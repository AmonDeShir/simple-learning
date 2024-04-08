import { Response } from "express";
import { SetDao } from "../models/set.model";
import { UsersDao } from "../models/user.model";
import { WordDao } from "../models/word.model";
import { AuthenticatedRequest } from "../middlewares/auth-guard.middleware";
import { LearningProgress } from "../types/learning-progress.type";
import { Language } from "../types/languages.type";

export namespace WordController {
  export async function search(req: AuthenticatedRequest<{ word: string }>, res: Response) {
    const { word } = req.params;
    const { user } = req.body;

    try {
      const words = await WordDao.search(word, user.id);

      const result = await Promise.all(words.map(async (word) => ({
        id: word._id,
        word: word.word,
        meaning: word.meaning,
        audio: word.audio,
        firstExample: word.firstExample,
        secondExample: word.secondExample,
        usedIn: (await SetDao.searchByWordId(word._id)).map((set) => ({
          id: set.id,
          title: set.title
        }))
      })));

      return res.status(200).json({
        status: 200,
        data: result
      })
    } 
    catch  {
      return res.status(500).json({
        status: 500,
        message: 'Internal server error'
      });
    }
  }

  export async function getDailyList(req: AuthenticatedRequest, res: Response) {
    const { user } = req.body;

    try {
      const cards = await WordDao.getDailyList(user.id);
      const languages = cards.reduce<Language[]>((result, word) => !result.includes(word.language) ? [...result, word.language] : result, []);

      return res.status(200).json({
        status: 200,
        data: { languages, cards }
      });
    } 
    catch {
      return res.status(500).json({
        status: 500,
        message: 'Internal server error'
      });
    }
  }

  export async function getMonthList(req: AuthenticatedRequest<{ month: string }>, res: Response) {
    const { month = "0" } = req.params;
    const { user } = req.body;
    
    try {
      const data = await WordDao.getMonthList(user.id, Number(month));

      return res.status(200).json({
        status: 200,
        data
      });
    }
    catch  {
      return res.status(500).json({
        status: 500,
        message: 'Internal server error'
      });
    }
  }

  export async function updateLearningProgress(req: AuthenticatedRequest<{}, { data: { id: string, progress: LearningProgress, mode: "flashcard" | "writing" | "information" }[]}>, res: Response) {
    const { user, data } = req.body;

    try {
      await WordDao.updateLearningProgress(user.id, data);
      await UsersDao.updateProgress(user.id);
      await SetDao.updateUserSetsProgress(user.id);

      return res.status(200).json({
        status: 200,
        message: 'Success'
      });
    }
    catch  {
      return res.status(500).json({
        status: 500,
        message: 'Internal server error'
      });
    }
  }
}