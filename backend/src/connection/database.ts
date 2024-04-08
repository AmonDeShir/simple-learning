import chalk from 'chalk';
import mongoose from 'mongoose';
import * as uuid from 'uuid';
import { Config } from '../config/config';

export namespace Database {

  const onOpen = () => {
    console.info(chalk.green('[database] connected'));
  };

  const onError = (error: { message: string }) => {
    console.error(chalk.red(`[database] connection error: ${error.message}`));
    process.exit();
  };

  export const connect = () =>
    mongoose
      .connect(Config.db.urlMain)
      .then(onOpen)
      .catch(onError);

  export const connectTest = () =>
    mongoose
      .connect(`${Config.db.urlTest}_${uuid.v4()}`);

  export const disconnect = () =>
    mongoose.connection.close();

  export const drop = () =>
    mongoose.connection.dropDatabase();
}