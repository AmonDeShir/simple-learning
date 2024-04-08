import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { Config } from './config/config'
import { Database } from './connection/database';
import { AuthRoutes } from './routes/auth.routes';
import { DictionaryRoutes } from './routes/dictionary.routes';
import { SetRoutes } from './routes/set.routes';
import { WordRoutes } from './routes/word.routes';
import { UserRoutes } from './routes/user.routes';

export const app = express();
Database.connect();

app.use(bodyParser.json({limit: '1000mb'}));
app.use(cookieParser());

app.use("/api/v1/auth/", AuthRoutes());
app.use("/api/v1/dictionary/", DictionaryRoutes());
app.use("/api/v1/sets/", SetRoutes());
app.use("/api/v1/words/", WordRoutes());
app.use("/api/v1/user/", UserRoutes());

app.listen(Config.server.port, () => {
  console.log(`Start listening at port ${Config.server.port}`)
})

