import { Response } from "express";
import { SetDao } from "../dao/set.dao";
import { UsersDao } from "../dao/user.dao";
import { WordDao } from "../dao/word.dao";
import { AuthenticatedRequest } from "../middlewares/auth-guard.middleware";
import { GameModes } from "../types/game.type";
import { SetConstructor, SetDocument, SetEditor, SetProgress } from "../types/set.type";
import { User } from "../types/user.type";

export namespace SetController {
  export async function list(req: AuthenticatedRequest, res: Response) {
    const { user } = req.body;
    const sets = await SetDao.getLastTen(user.id);
    
    const result = await Promise.all(sets.map(async set => {
      const data = set.toJSON() as any;

      return {
        id: data._id,
        title: data.title,
        progress: data.progress,
        words: (await WordDao.findByIds(data.words.slice(0, 12))).map(({ _id, word, meaning }) => ({
          id: _id,
          word: word,
          meaning: meaning,
        }))
      }
    }));

    return res.status(200).json({
      status: 200,
      data: result
    })
  }

  export async function search(req: AuthenticatedRequest<{ word: string }>, res: Response) {
    const { word } = req.params;
    const { user } = req.body;
    const sets = await SetDao.search(word, user.id);

    let result = await Promise.all(sets.map(async set => {
      const data = set.toJSON() as any;

      return {
        id: data._id.toString(),
        title: data.title,
        progress: data.progress,
        protected: false,
        words: (await WordDao.findByIds(data.words.slice(0, 12))).map(({ _id, word, meaning }) => ({
          id: _id,
          word: word,
          meaning: meaning,
        }))
      }
    }));

    const savedWordsIndex = result.findIndex(({ id }) => id === user.savedWords);

    if (savedWordsIndex !== -1) {
      let savedWords = result.splice(savedWordsIndex, 1)[0];

      savedWords = {
        ...savedWords,
        protected: true,
      }

      result = [ savedWords, ...result ];
    }

    return res.status(200).json({
      status: 200,
      data: result
    })
  }

  export async function getAll(req: AuthenticatedRequest, res: Response) {
    const { user } = req.body;
    const sets = await SetDao.findByUser(user.id);

    let result = await Promise.all(sets.map(async set => {
      const data = set.toJSON() as any;

      return {
        id: data._id.toString(),
        title: data.title,
        progress: data.progress,
        protected: false,
        words: (await WordDao.findByIds(data.words.slice(0, 12))).map(({ _id, word, meaning }) => ({
          id: _id,
          word: word,
          meaning: meaning,
        }))
      }
    }));

    const savedWordsIndex = result.findIndex(({ id }) => id.toString() === user.savedWords);

    if (savedWordsIndex !== -1) {
      let savedWords = result.splice(savedWordsIndex, 1)[0];

      savedWords = {
        ...savedWords,
        protected: true,
      }

      result = [ savedWords, ...result ];
    }

    return res.status(200).json({
      status: 200,
      data: result
    })
  }

  export async function game(req: AuthenticatedRequest, res: Response) {
    const set = await SetDao.findById(req.params.id);
  
    if (!(req.params.mode in GameModes)) {
      return res.status(404).json({
        status: 400,
        message: 'Invalid game mode'
      })
    }

    if (!set) {
      return res.status(404).json({
        status: 404,
        message: 'Set with that id not exist'
      })
    }

    if(set.user !== req.body.user.id) {
      return res.status(401).json({
        status: 401,
        message: 'You do not have permission to view this set'
      })
    }

    return res.status(200).json({
      status: 200,
      data: await SetDao.getGameData(set.id, req.params.mode)
    })
  }

  
  export async function progress(req: AuthenticatedRequest, res: Response) {
    const { user } = req.body;
    
    try {
      return res.status(200).json({
        status: 200,
        data: user.progress
      })
    }
    catch(e) {
      return res.status(200).json({
        status: 200,
        data: []
      })
    }
  }

  export async function findOne(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    const set = await SetDao.findById(req.params.id);
    const user = req.body.user;

    if (!set) {
      return res.status(404).json({
        status: 404,
        message: 'Set with that id not exist'
      })
    }

    if(set.user !== req.body.user.id) {
      return res.status(401).json({
        status: 401,
        message: 'You do not have permission to view this set'
      })
    }

    return res.status(200).json({
      status: 200,
      data: await setDataToJson(set, user)
    })
  }

  async function setDataToJson(set: SetDocument, user: User) {
    const json = set.toJSON() as any;
    const words = await Promise.all((await WordDao.findByIds(json.words)).map(async ({ _id, word, meaning, language, audio, firstExample, secondExample }) => ({
      id: _id,
      word,
      meaning,
      audio,
      firstExample,
      secondExample,
      language,
      usedIn: (await SetDao.searchByWordId(_id)).filter(({ id }) => id !== set.id).map((set) => ({
        id: set.id,
        title: set.title
      }))
    })));
    
    return {
      id: json._id,
      title: json.title,
      progress: json.progress,
      protected: json._id.toString() === user.savedWords,
      words
    }
  }

  export async function create(req: AuthenticatedRequest<{}, { data: SetConstructor }>, res: Response) {
    const { user, data } = req.body;

    if (!data.user) {
      data.user = req.body.user._id.toString();
    }

    try {
      const set = await SetDao.create(data);
      
      user.sets.push(set._id.toString());

      await user.validate();
      await user.save();

      await UsersDao.updateProgress(user.id);
      
      return res.status(200).json({
        status: 200,
        data: setDataToJson(set, user)
      })
    }
    catch(e) {
      return res.status(400).json({
        status: 400,
        message: 'Set not created',
        error: e
      })
    }
  }

  export async function update(req: AuthenticatedRequest<{ id: string }, { data: SetEditor }>, res: Response) {
    const set = await SetDao.findById(req.params.id);

    if (!set) {
      return res.status(404).json({
        status: 404,
        message: 'Set with that id not exist'
      })
    }

    if(set.user !== req.body.user.id) {
      return res.status(401).json({
        status: 401,
        message: 'You do not have permission to edit this set'
      })
    }

    try {
      await SetDao.edit(req.body.data);
      await UsersDao.updateProgress(req.body.user.id);

      return res.status(200).json({
        status: 200,
        message: 'success'
      })
    }
    catch (e) {
      console.log('error', e);
    }

    return res.status(400).json({
      status: 400,
      message: 'Set not edited'
    })
  }

  export async function remove(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    const set = await SetDao.findById(req.params.id);

    if (!set) {
      return res.status(404).json({
        status: 404,
        message: 'Set with that id not exist'
      })
    }

    if(set.user !== req.body.user.id) {
      return res.status(401).json({
        status: 401,
        message: 'You do not have permission to remove this set'
      })
    }

    try {
      await SetDao.removeById(set._id, req.body.user.id);
      await UsersDao.updateProgress(req.body.user.id);

      return res.status(200).json({
        status: 200,
        message: 'success'
      })
    }
    catch {}

    return res.status(400).json({
      status: 400,
      message: 'Set not deleted'
    })
  }
}