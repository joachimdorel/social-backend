import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

const users: any[] = [];

module.exports = (passport: any) => {

  // Passport
  // Passsport strategy for inscription
  passport.use(
    'local-signup', 
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, async function(req, email, password, done) {
      // check if the user already exist
      
      const user = users.find(user => user.email === email);
      if (user) {
        return done(null, false, { message: 'Email already used.' });
      }

      // hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // creation of the user
      const newUser = { 
        id: Date.now().toString(),
        email: email,
        password: hashedPassword
      };
      users.push(newUser);

      return done(null, newUser);
    })
  );

  // Passport strategy for connexion
  passport.use(
    'local-login', 
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, function(req, email, password, done) {

      const user = users.find(user => user.email === email);

      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return done(err);
        }

        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
      });
    })
  );

  passport.serializeUser((user: any, done: any) => {
    // serialize the user in the session
    // serialize: only keep an id to track the user
    done(null, user.id);
  });

  passport.deserializeUser((id: any, done: any) => {
    // deserialize the user
    // deserialization: from an id, get all the data
    // of the user (email, name, password...)
    const user = users.find(user => user.id === id);
    done(null, user || false);
  });
};

// export default passport;