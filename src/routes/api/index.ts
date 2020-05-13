import express from 'express';
import user from './user';

const api = express.Router();

api.use('/user', user);


export default api;
