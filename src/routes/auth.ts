import jwt from 'express-jwt';
import { Request } from 'express';
import { AUTH_CLIENT_SECRET } from '../config/secrets';

const getTokenFromHeaders = (req: Request) => {
  const { headers: { authorization } } = req;

  if (authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};

const auth = {
  required: jwt({
    secret: AUTH_CLIENT_SECRET,
    userProperty: 'payload',
    getToken: getTokenFromHeaders
  }),
  optional: jwt({
    secret: AUTH_CLIENT_SECRET,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false
  })
};

export default auth;
