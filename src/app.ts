import express, { Router } from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
const router = Router();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

interface ResponseError extends Error {
	status?: number;
	statusCode?: number;
}

function errorHandler(err: ResponseError, req: Request, res: Response) {
    console.error(err.message);
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    res.status(err.statusCode).send(err.message);
}

app.use(errorHandler);

app.listen(port, (): void => {
    console.log(`App listening on port ${port}!`);
});
