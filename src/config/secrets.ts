import logger from '../util/logger';
import dotenv from 'dotenv';
import fs from 'fs';

// eslint-disable-next-line no-sync
if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
} else {
  logger.error('No .env file in root directory');
}

const dbUsername = process.env.MONGO_USERNAME;
const dbPassword = process.env.MONGO_PASSWORD;
const dbHostName = process.env.MONGO_HOSTNAME;
const dbPort = process.env.MONGO_PORT;
const dbName = process.env.MONGO_DB;


export const ENVIRONMENT = process.env.NODE_ENV;
export const AUTH_CLIENT_SECRET = process.env.AUTH_CLIENT_SECRET;
export const MONGODB_URI = `mongodb://${dbUsername}:${dbPassword}@${dbHostName}:${dbPort}/${dbName}?authSource=admin`;
