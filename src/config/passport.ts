import passport from 'passport';
import passportLocal from 'passport-local';
import { User } from '../models';

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('deserializeUser');
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'user[email]',
      passwordField: 'user[password]'
    },
    (email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user) {
            return done(null, false, {
              message: `Email ${email} not found.`
            });
          }

          if (!user.validatePassword(password)) {
            return done(null, false, {
              message: 'Invalid password'
            });
          }

          return done(null, user);
        })
        .catch(done);
    }
  )
);

export default passport;
