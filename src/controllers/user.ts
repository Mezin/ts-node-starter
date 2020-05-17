import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import crypto from 'crypto';
import passport from 'passport';

function setPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 512, 'sha512')
    .toString('hex');

  return { salt, hash };
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({}, { hash: 0, salt: 0, __v: 0 });
    res.send(users);
  } catch (err) {
    return next(err);
  }
};

// TODO implement getUser ctrl
// export const getUser = (req: Request, res: Response, next: NextFunction) => {
// };

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    await User.deleteOne({ _id: id });
    res.send({ code: 200, message: 'User deleted' });
  } catch (err) {
    return next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    let user = req.body;

    if (user.password) {
      // TODO add old password check
      user = { user, ...setPassword(user.password) };
    }
    delete user.password;

    await User.findOneAndUpdate({ _id: id }, user, {
      new: true
    });
    res.send({ code: 200, message: 'User updated' });
  } catch (err) {
    return next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body: { user } } = req;

    if (!user.email) {
      return res.status(422).json({
        errors: {
          email: 'is required'
        }
      });
    }

    if (!user.password) {
      return res.status(422).json({
        errors: {
          password: 'is required'
        }
      });
    }

    const finalUser = new User(user);
    finalUser.setPassword(user.password);
    await finalUser.save();
    res.json({ user: finalUser.toAuthJSON(), message: 'User created' })
  } catch (err) {
    return next(err);
  }
};

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.body;

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required'
      }
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required'
      }
    });
  }

  return passport.authenticate(
    'local',
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(err);
      }

      if (passportUser) {
        const currentUser = passportUser;
        currentUser.token = passportUser.generateJWT();

        return res.json({ user: currentUser.toAuthJSON() });
      }

      res.status(400);
      return res.send(info);
    }
  )(req, res, next);
};
