import mongoose, { Types } from 'mongoose';
import { SetConstructor, SetDocument, SetEditor, SetProgress } from '../types/set.type';
import { SetSchema } from '../schemas/set.schema';
import { WordDao } from './word.model';
import { UsersDao } from './user.model';
import { GameItem, GameResponse, GameType } from '../types/game.type';
import { Language } from '../types/languages.type';

export namespace SetDao {
  export const dao = mongoose.model('Set', SetSchema);;

  export async function create(data: SetConstructor): Promise<SetDocument> {
    const { words, ...constructor } = data;
    const set = new dao(constructor);

    await set.validate();

    set.words = await Promise.all(
      words.map(async (word) => await WordDao.editOrImport(word))
    );
    
    set.progress = await calcSetProgress(set.words);

    await set.save();

    return set;
  }

  async function calcSetProgress(wordIds: string[]): Promise<SetProgress> {
    const words = await WordDao.findByIds(wordIds);

    const progress: SetProgress = {
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

  export async function updateUserSetsProgress (user: string) {
    const sets = await SetDao.findByUser(user);

    await Promise.all(sets.map(async set => {
      set.progress = await calcSetProgress(set.words);

      await set.save();
    }));
  }

  export async function edit(data: SetEditor): Promise<void> {
    const { words, id, title, lastLearn } = data;
    const set = await findById(id);
  
    if (!set) {
      throw new Error('Set not exist');
    }

    const user = await UsersDao.findAnyTypeUserById(set.user);

    if (!user) {
      return;
    } 

    if (title && user.savedWords !== set.id) {
      set.title = title;
    }

    if (lastLearn) {
      set.lastLearn = lastLearn;
    }
    
    await set.validate();

    if (words) {
      set.words = await Promise.all(
        words.map(async (word) => await WordDao.editOrImport(word))
      );
    }

    set.progress = await calcSetProgress(set.words);

    await set.save();
  }

  export async function removeById(id: Types.ObjectId, userId: string): Promise<void> {
    const user = await UsersDao.findAnyTypeUserById(userId);

    if (user) {
      if (id.toString() === user.savedWords) {
        return;
      }

      const result = await dao.findByIdAndDelete(id);
      
      user.sets = user.sets.filter(set => set.toString() !== id.toString());
      await user.save();
    }

    await WordDao.clear();
  }

  export async function findById(id: string): Promise<SetDocument | null> {
    return await dao.findById(id)
  }

  export async function findByUser(id: string): Promise<SetDocument[]> {
    return await dao.find({ user: id });
  }

  export async function findAll(): Promise<SetDocument[]> {
    return await dao.find()
  }

  export async function getLastTen(id: string): Promise<SetDocument[]> {
    return await dao.find({ user: id }).sort({ lastLearn: -1 }).limit(10);
  }

  export async function searchByWordId(id: string): Promise<SetDocument[]> {
    const sets = await dao.find({ words: id });

    return sets;
  }

  export async function search(query: string, user: string) {
    const result: SetDocument[] = await dao.find({ title: { $regex: query, $options: 'i' }, user });

    let sets = await SetDao.findByUser(user);
    let words = await WordDao.search(query, user);
  
    sets = sets.filter(set => !result.some(res => res._id.toString() === set._id.toString()));

    for (const word of words) {
      let set: SetDocument | undefined;
      let i = 0;

      do {
        set = sets.find(set => set.words.includes(word._id.toString()));
        
        if (set) {
          result.push(set);
          sets = sets.filter(filter => filter !== set);
          i += 1;
        }
      } while (set);
    }

    return result;
  }

  export async function getGameData(setId: string, mode: GameType): Promise<GameResponse> {
    const set = await findById(setId);

    if (!set) {
      throw new Error('Set not exist');
    }

    const items: GameItem[] = [];

    const words = WordDao.wordsToGameItems(mode, await WordDao.findByIds(set.words));
    const languages = words.reduce<Language[]>((result, word) => !result.includes(word.language) ? [...result, word.language] : result, []);
    const examples: GameItem[] = [];

    //unpack items from the set and shuffle them
    //An item should always be displayed first, before its examples
    while (words.length + examples.length > 0) {
      const indexItem = Math.floor(Math.random() * words.length);
      const indexExample = Math.floor(Math.random() * examples.length);
      
      const item = words.splice(indexItem, 1)[0];
      const example = examples.splice(indexExample, 1)[0];

      if (item) {
        const { examples: itemExamples, ...itemData} = item;

        examples.push(...itemExamples);
        items.push(itemData);
      }

      if (example) {
        items.push(example);
      }
    }

    return { id: set._id.toString(), items, languages, mode }
  }
}