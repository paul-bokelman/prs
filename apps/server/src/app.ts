import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { env, preflightENV } from './lib/env';
import { services } from './services/router';
// import { client } from '../../../config';

preflightENV();

export const app: Express = express();

app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));

app.use('/', services);

const port = env('PORT') || 8000;

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
