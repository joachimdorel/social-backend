import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import pool from '../utils/pgPool';

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

      try {

        // check that the user does not alreayd exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
          return done(null, false, { message: 'This email address is alreayd used.'});
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create the new user
        const newUser = await pool.query(
          'INSERT INTO users (email, password) VALUES ($1,$2) RETURNING *',
          [email, hashedPassword]
        );

        return done(null, newUser.rows[0]);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Passport strategy for connexion
  passport.use(
    'local-login', 
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, async (req, email, password, done) => {
      try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        bcrypt.compare(password, user.rows[0].password, (err, isMatch) => {
          if (err) {
            return done(err);
          }

          if (!isMatch) {
            return done(null, false, { message: 'The password is incorrect.'});
          }

          return done(null, user.rows[0]);
        });
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user: any, done: any) => {
    // serialize the user in the session
    // serialize: only keep an id to track the user
    done(null, user.id);
  });

   passport.deserializeUser(async (id: any, done: any) => {
    // deserialize the user
    // deserialization: from an id, get all the data of the user (email, name, password...)
    try {
      const result  = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
      const user = result.rows[0];
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  });
};

// export default passport;