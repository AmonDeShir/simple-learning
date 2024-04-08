import { Types } from 'mongoose';
import { WordConstructor, WordDocument, WordEditor, WordWithId } from '../types/word.type';
import { wordModel } from '../models/word.model';
import { isObjectId } from '../utils/is-object-id';
import { TextToSpeech } from '../text-to-speech/text-to-speech';
import { isWordEditor } from '../utils/is-word-editor';
import { DefaultLearningProgress } from '../models/learning-progress.model';
import { Example, ExampleConstructor } from '../types/example.type';
import { SetDao } from './set.dao';
import { UsersDao } from './user.dao';
import { GameItem, GameItemWithExamples, GameType } from '../types/game.type';
import { LearnItem, LearnItemWithExamples } from '../types/learn.type';
import { getDayOfNextMonth, getDaysInCurrentMonth, getDaysInMonth, getDaysInNextMonth } from '../utils/get-days-in-current-month';
import { LearningProgress } from '../types/learning-progress.type';
import { Language } from '../types/languages.type';

export namespace WordDao {
  export const model = wordModel;

  export async function create(data: WordConstructor) {
    const { firstExample, secondExample, ...constructor } = data;
    const word = new model(constructor);
    
    await word.validate();
    
    word.audio = await TextToSpeech.generate(word.word, data.language);

    if (firstExample) {
      word.firstExample = await createExample(firstExample, word.language);
    }

    if (secondExample) {
      word.secondExample = await createExample(secondExample, word.language);
    }

    if ('firstExample' in data && !data.firstExample) {
      word.firstExample = undefined;
    }

    if ('secondExample' in data && !data.secondExample) {
      word.secondExample = undefined;
    }

    word.progress = DefaultLearningProgress();
    
    await word.validate();
    await word.save();

    return word;
  }

  export async function edit(data: WordEditor){
    const { id, firstExample, secondExample, ...properties } = data;
    const word = await findById(id);
    const needsNewAudio = (word?.word !== properties.word) || word?.audio;

    if (!word) {
      throw new Error(`Word not found`);
    }

    (Object.keys(properties) as Array<keyof typeof properties>).forEach((key) => {
      if (properties[key]) {
        (word as any)[key] = properties[key];
      }
    });

    await word.validate();

    if (needsNewAudio) {
      word.audio = await TextToSpeech.generate(word.word, word.language);
    }

    if (firstExample) {
      word.firstExample = await createExample(firstExample, word.language);
    }
    else {
      word.firstExample = undefined;
    }

    if (secondExample) {
      word.secondExample = await createExample(secondExample, word.language);
    }
    else {
      word.secondExample = undefined;
    }
    
    await word.validate();
    await word.save();

    return word;
  }

  async function createExample(data: ExampleConstructor, lang: Language) {
    return {
      ...data,
      progress: DefaultLearningProgress(),
      audio: await TextToSpeech.generate(data.example, lang),
    }
  }

  export async function createOrImport(word: string | WordConstructor ): Promise<string> {
    if (!isObjectId(word)) {
      return (await WordDao.create(word))._id.toString();
    }
          
    if (!(await WordDao.isCreated(word))) {
      throw new Error(`Word not found`);
    }

    return word.toString();
  }

  export async function editOrImport(data: string | WordConstructor | WordEditor ): Promise<string> {
    if (isWordEditor(data)) {
      return (await WordDao.edit(data))._id.toString();
    }
          
    return await WordDao.createOrImport(data);
  }

  export async function isCreated(id: string): Promise<boolean> {
    return Boolean(await WordDao.findById(id));
  }
  
  export async function findById(id: string): Promise<WordDocument | null> {
    return model.findById(id);
  }

  export async function findByIds(ids: string[]): Promise<WordWithId[]> {
    return await model.find({ _id: { $in: ids.map(id => new Types.ObjectId(id)) }});
  }

  export async function findAll(): Promise<WordDocument[]> {
    return model.find();
  }

  export async function clear() {
    const users = await UsersDao.findAll();

    const userSets = await Promise.all(users.map(async (user) => await SetDao.findByUser(user.id)));
    const inUse = userSets.flatMap(sets => sets.flatMap(set => set.words));
      
    let unusedWords: WordDocument[] = await model.find({ _id: { $nin: inUse }});

    await model.deleteMany({ _id: { $in: unusedWords.map(({ _id }) => _id) }})
  }

  export async function findByUser(userId: string): Promise<WordWithId[]> {
    const user = await UsersDao.findAnyTypeUserById(userId);

    if (!user) {
      return [];
    }

    const sets = await SetDao.findByUser(userId);
    const words = await WordDao.findByIds(removeDuplicates(sets.flatMap(set => set.words)));

    return words;
  }

  export async function findByUserWithSet(userId: string): Promise<(WordWithId & { set: string })[]> {
    const user = await UsersDao.findAnyTypeUserById(userId);
    const setMap: { [key: string]: string } = {};

    if (!user) {
      return [];
    }

    const sets = await SetDao.findByUser(userId);
    
    for (const set of sets) {
      for (const word of set.words) {
        if (!setMap[word]) {
          setMap[word] = set._id.toString();
        }
      }
    }

    const words = await WordDao.findByIds(removeDuplicates(sets.flatMap(set => set.words)));

    return words.map(word => ({
      _id: word._id,
      meaning: word.meaning,
      language: word.language,
      word: word.word,
      audio: word.audio,
      firstExample: word.firstExample,
      secondExample: word.secondExample,
      progress: word.progress,
      set: setMap[word._id.toString()] 
    }));
  }

  export function removeDuplicates(items: string[]): string[] {
    return items.filter((item, index) => items.indexOf(item) === index);
  }

  export async function search(text: string, user: string): Promise<WordWithId[]> {
    if (text.trim().length === 0) {
      return [];
    }

    const words = await WordDao.findByUser(user);

    return words.filter((word) => {
      return isStringIncludeIn(text, word.word) 
          || isStringIncludeIn(text, word.meaning)  
          || isStringIncludeIn(text, word.firstExample?.example ?? '')
          || isStringIncludeIn(text, word.firstExample?.translation ?? '')
          || isStringIncludeIn(text, word.secondExample?.example ?? '')
          || isStringIncludeIn(text, word.secondExample?.translation ?? '')
    });
  }

  function isStringIncludeIn(word1: string, word2: string) {
    return word2.toLowerCase().includes(word1.toLowerCase());
  }

  export function wordsToGameItems(mode: GameType, words: WordWithId[]): GameItemWithExamples[] {
    return words.map((word) => ({
      id: word._id.toString(),
      wordId: undefined,
      text: word.word,
      translation: word.meaning,
      audio: word.audio,
      mode: getGameItemMode(mode),
      language: word.language,
      invert: mode !== 'speller' && Math.random() > 0.5,
      examples: examplesToGameItems(word._id.toString(), mode, word.language, [word.firstExample, word.secondExample])
    }))
  }

  function getGameItemMode(mode: GameType) {
    const modes = ['flashcard', 'writing', 'speller' ] as const;
  
    switch (mode) {
      case 'flashcards':
        return modes[0];
      case 'writing':
        return modes[1];
      case 'speller':
        return modes[2];
      case 'mix':
        return modes[Math.floor(Math.random() * modes.length)];
    }
  }

  function examplesToGameItems(parentId: string, mode: GameType, language: Language, examples: (Example | undefined)[]): GameItem[] {
    return examples.flatMap((example, index) => {
      if (!example) {
        return [];
      }

      return [({
        id: `${parentId}-${index}`,
        wordId: parentId,
        text: example.example,
        translation: example.translation,
        audio: example.audio,
        mode: getGameItemMode(mode),
        language: language,
        invert: mode !== 'speller' && Math.random() > 0.5,
      })]
    });
  }

  export function convertWordsToLearnItems(words: (WordWithId & { set: string })[]): LearnItem[] {
    const wordsWithExamples = WordDao.convertWordsToLearnItemWithExamples(words);
    return wordsWithExamples.flatMap(({examples, ...word }) => [word, ...examples]);
  }

  export function convertWordsToLearnItemWithExamples(words: (WordWithId & { set: string })[]): LearnItemWithExamples[] {
    return words.map((word) => {
      const mode = getLearnItemMode();

      return {
        id: word._id.toString(),
        set: word.set,
        wordId: undefined,
        text: word.word,
        translation: word.meaning,
        audio: word.audio,
        language: word.language,
        progress: word.progress,
        mode: mode,
        invert: mode === 'writing' ? false : Math.random() > 0.5,
        examples: examplesToLearnItems(word._id.toString(), word.set, word.language, [word.firstExample, word.secondExample])
      }
    })
  }

  function examplesToLearnItems(parentId: string, set: string, language: Language, examples: (Example | undefined)[]): LearnItem[] {
    return examples.flatMap((example, index) => {
      if (!example) {
        return [];
      }

      const mode = getLearnItemMode();

      return [({
        id: `${parentId}-${index}`,
        set: set,
        wordId: parentId,
        text: example.example,
        translation: example.translation,
        language: language,
        audio: example.audio,
        progress: example.progress,
        mode: mode,
        invert: mode === 'writing' ? false : Math.random() > 0.5,
      })]
    });
  }

  function getLearnItemMode() {
    const modes = ['flashcard', 'writing'] as const;
    return modes[Math.floor(Math.random() * modes.length)];
  }

  export async function getDailyList(user: string) {   
    const words = await WordDao.findByUserWithSet(user);
    const allItems = WordDao.convertWordsToLearnItems(words);
    const today = new Date().setHours(23, 59, 59, 999);
    
    const items = allItems.filter((item) => item.progress.nextRepetition <= today);

    let result: LearnItem[] = [];

    //shuffle items
    //An item should always be displayed first, before its examples
    while (items.length > 0) {
      const index = Math.floor(Math.random() * items.length);
      const item = items.splice(index, 1)[0];

      if (item) {
        if (item.wordId) {
          if (result.find((i) => i.id === item.wordId)) {
            result.push(item);
            continue;
          }

          let word: LearnItem | undefined = undefined;
          const wordIndex = items.findIndex((i) => i.id === item.wordId);
          
          if (wordIndex !== -1) {
            word = items.splice(wordIndex, 1)[0];
          }

          if (!word) {
            word = allItems.find((i) => i.id === item.wordId);
            
            if (word) {
              word.mode = 'information';
            }
          }

          if (word) {
            const index = Math.floor(Math.random() * result.length);

            result = [
              ...result.slice(0, index),
              word,
              ...result.slice(index),
              item
            ]
          }
          else {
            result.push(item);
          }
        }
        else {
          result.push(item);
        }
      }
    }

    return result;
  }

  export async function getMonthList(user: string, page: number) {
    const words = await WordDao.findByUserWithSet(user);
    let itemsPerMonth: { month: number, days: LearnItem[][] }[] = [];
    const today = new Date().setHours(23, 59, 59, 999);
    let items = WordDao.convertWordsToLearnItems(words);

    items = items.filter((item) => item.mode !== 'information');

    let i = 0;
    while (items.length > 0) {
      const day = new Date(today + i * 86400000);
      const month = day.getMonth() - new Date().getMonth();

      if (itemsPerMonth[month] === undefined) {
        itemsPerMonth[month] = {
          month,
          days: []
        };
      }

      itemsPerMonth[month].days.push(items.filter((item) => item.progress.nextRepetition <= day.setHours(23, 59, 59, 999)));
      items = items.filter((item) => item.progress.nextRepetition > day.setHours(23, 59, 59, 999));

      i += 1;
    }

    itemsPerMonth = itemsPerMonth.filter((item) => item.days.flatMap(array => array).length > 0); 
    const result = itemsPerMonth[page];

    return {
      date: getDayOfNextMonth(result.month, page !== 0 ? 1 : undefined).getTime(),
      days: result.days,
      isLastPage: itemsPerMonth.length - 1 === page,
    };
  }

  export async function updateLearningProgress(user: string, items: { id: string, progress: LearningProgress, mode: "flashcard" | "writing" | "information" }[]) {
    const sets = await SetDao.findByUser(user);
    const words = removeDuplicates(sets.flatMap(set => set.words))
    
    for (const item of items) {
      const [ wordId, exampleIndex ] = item.id.split('-');
      const word = await WordDao.findById(wordId);

      if (!word || words.indexOf(wordId) === -1 || item.mode === 'information') {
        continue;
      }

      if (exampleIndex === '0' && word.firstExample) {
        word.firstExample.progress = item.progress;
      }
      else if(exampleIndex === '1' && word.secondExample) {
        word.secondExample.progress = item.progress;
      }
      else {
        word.progress = item.progress;
      }

      await word.validate();
      await word.save();
    }
  }
}