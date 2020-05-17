import express, { Router } from 'express';
import bodyParser from 'body-parser';
import passport from './config/passport';
import cors from 'cors';
import lusca from 'lusca';
import connect from './db';
import routes from './routes';

import {
  MONGODB_URI
} from './config/secrets';


const app = express();
const router = Router();

const corsConfig = {
  origin: '*',
  preflightContinue: false,
  optionsSuccessStatus: 204
};

connect(MONGODB_URI);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsConfig));
app.use(passport.initialize());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(router);

// entry route
app.use('/', routes);

export default app;
