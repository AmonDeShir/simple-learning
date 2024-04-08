import mongoose, { Types, ObjectId, Document } from 'mongoose';
import { User, UserConstructor } from '../types/user.type';
import { userSchema } from '../schemas/user.schema';
import { locallyUserSchema } from '../schemas/locally-user.schema';
import { LocallyUser } from '../types/locally-user.type';
import { getDaysInCurrentMonth } from '../utils/get-days-in-current-month';
import { SetDao } from './set.model';
import { WordConstructor } from '../types/word.type';
import { WordDao } from './word.model';

export namespace UsersDao {
  export const dao = mongoose.model('User', userSchema);
  export const locallyDao = mongoose.model('LocallyUser', locallyUserSchema);

  export const create = async (data: UserConstructor) => {
    const user = new dao(data);

    await user.validate();
    await user.save();

    const savedWords = await SetDao.create({
      title: 'Saved words',
      user: user._id.toString(),
      words: []
    });

    await savedWords.save();

    user.savedWords = savedWords._id.toString();
    user.sets = [savedWords._id.toString()];
    await user.save();

    await updateProgress(user.id);

    return user;
  }

  export const createLocally = async () => {
    const user = new locallyDao();
    
    await user.validate();
    await user.save();

    const savedWords = await SetDao.create({
      title: 'Saved words',
      user: user._id.toString(),
      words: []
    });

    await savedWords.save();

    user.savedWords = savedWords._id.toString();
    user.sets = [savedWords._id.toString()];
    await user.save();

    await updateProgress(user.id);

    return user;
  }

  export const merge = async (userId: string, locallyUserId: string) => {
    const user = await UsersDao.findById(userId);
    const locallyUser = await UsersDao.findLocallyById(locallyUserId);

    if (!user || !locallyUser) {
      throw new Error('User not exist');
    }
    
    const oldSavedWords = await SetDao.findById(user.savedWords);
    console.log(3.1);

    user.sets = locallyUser.sets;
    user.savedWords = locallyUser.savedWords;
    user.lastLearningDate = locallyUser.lastLearningDate;
    user.progress = locallyUser.progress;

    console.log(3.2);

    const sets = await SetDao.findByUser(locallyUser._id.toString());
    console.log(3.3);

    await user.save();
    console.log(3.4);

    await locallyUser.remove();
    console.log(3.5);

    if (oldSavedWords) {
      await oldSavedWords.remove();

    }

    console.log(3.6);

    for (const set of sets) {
      set.user = user._id.toString();
      await set.save();
    }

    console.log(3.7);

    await updateProgress(user.id);
  };

  export const addWord = async (user: (User | LocallyUser) & Document<any, any, any>, word: string | WordConstructor) => {
    const wordId = await WordDao.createOrImport(word);
    const set = await SetDao.findById(user.savedWords);

    if (set) {
      set.words = [...set.words, wordId];
      
      await set.validate();
      await set.save();
    }
  }

  export const updateProgress = async (userId: string) => {
    const user = await UsersDao.findAnyTypeUserById(userId);
    
    if (!user) {
      return;
    }

    const lastUpdate = new Date(user.lastLearningDate).getMonth();

    if (lastUpdate - new Date().getMonth() !== 0) {
      const days = getDaysInCurrentMonth();

      for (let i = 0; i < days; i++) {
        user.progress[i] = {
          learning: 0, 
          relearning: 0,  
          graduated: 0
        };
      }
    }

    user.progress = populateLosesDays(user.progress);
    user.lastLearningDate = Date.now();
    user.progress[new Date().getDate() - 1] = await calcProgress(userId);

    await user.validate();
    await user.save();
  }

  const populateLosesDays = (data: { learning: number, relearning: number, graduated: number}[]) => {
    const result = [...data];

    for (let i = 1; i < new Date().getDate(); i++) {
      const prev = data[i - 1];
      const current = data[i];

      const value = current.learning + current.relearning + current.graduated;

      if (value === 0) {
        result[i] = { ...prev };
      }
    }

    return result;
  }

  const calcProgress = async (user: string) => {
    const words = await WordDao.findByUser(user);

    const progress = {
      learning: 0,
      relearning: 0,
      graduated: 0,
    };

    words.forEach(word => {
      progress[word.progress.phase] += 1;

      if (word.firstExample) {
        progress[word.firstExample.progress.phase] += 1;
      }

      if (word.secondExample) {
        progress[word.secondExample.progress.phase] += 1;
      }
    })

    return progress;
  }

  export const findByEmail = (email: string) => 
    dao.findOne({ email });

  export const findById = (id: string | ObjectId) => 
    dao.findById(id)

  export const findLocallyById = (id: string | ObjectId) => 
    locallyDao.findById(id)

  export async function findAnyTypeUserById(id: string | ObjectId): Promise<(User & LocallyUser & Document<any, any, any> & { _id: Types.ObjectId; }) | null> {
    const result = await dao.findById(id);

    if (!result) {
      return await locallyDao.findById(id);
    }

    return result;
  }

  export async function findAll() {
    return [...(await dao.find()), ... await(locallyDao.find())];
  }
}