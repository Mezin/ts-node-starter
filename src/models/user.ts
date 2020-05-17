import mongoose from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { AUTH_CLIENT_SECRET } from '../config/secrets';

const { Schema } = mongoose;

class JWTToken {
  token: string;
}

export type UserDocument = mongoose.Document & {
  email: string;
  username: string;
  role: string;
  hash: string;
  salt: string;

  setPassword: (password: string) => void;
  validatePassword: (password: string) => boolean;
  generateJWT: () => string;
  toAuthJSON: () => JWTToken;
};

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  role: { type: String },
  hash: String,
  salt: String
}, { timestamps: true });

UserSchema.methods.setPassword = function (password: string) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
};

UserSchema.methods.validatePassword = function (password: string) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 1);

  return jwt.sign(
    {
      email: this.email,
      username: this.username,
      role: this.role,
      id: this._id,
      exp: Math.floor(expirationDate.getTime() / 1000)
    },
    AUTH_CLIENT_SECRET
  );
};

UserSchema.methods.toAuthJSON = function () {
  return {
    token: this.generateJWT()
  };
};

export const User = mongoose.model<UserDocument>('User', UserSchema);
