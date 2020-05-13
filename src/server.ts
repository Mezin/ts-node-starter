import app from './app';

import { NextFunction, Request, Response } from 'express';
import { ResponseError } from './types';

const port = process.env.PORT || 3000;

function errorHandler(err: ResponseError, req: Request, res: Response, next: NextFunction) {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  res.status(err.statusCode).send(err.message);
}

app.use(errorHandler);

const server = app.listen(port, (): void => {
  console.log(`App listening on port ${port}!`);
});

export default server;
