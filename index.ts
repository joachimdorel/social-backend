import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

// Simulate a user db with an array
const users: any[] = [];

const app = express();
app.use(express.json());
// TODO add secret key here
app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

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
}));

passport.serializeUser((user: any, done) => {
  // serialize the user in the session
  // serialize: only keep an id to track the user
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // deserialize the user
  // deserialization: from an id, get all the data
  // of the user (email, name, password...)
  const user = users.find(user => user.id === id);
  done(null, user || false);
});

// Routes
app.get('', (req, res) => {
  res.send('Home page');
});

app.get('/error', (req, res) => {
  res.send('Error page');
});

app.post(
  '/signup', 
  passport.authenticate('local-signup', { 
    successRedirect: '/signup/success', 
    failureRedirect: '/signup/failure'
  })
);

// connexion
app.post(
  '/login', 
  passport.authenticate('local-login', {
    successRedirect: '/login/success',
    failureRedirect: '/login/failure',
  })
);

app.get('/signup/success', (req, res) => {
  res.send('Registration successful')
});

app.get('/signup/failure', (req, res) => {
  res.send('Failure during the registration');
});

app.get('/login/success', (req, res) => {
  res.send('Login successful');
});

app.get('/login/failure', (req, res) => {
  res.send('Failure during login');
});

// middleware for authentication
const ensureAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

app.get('/user', ensureAuthenticated, (req, res) => {
  res.send('Welcome on the user page');
});

app.delete('/logout', (req: any, res: any) => {
  req.logOut();
  res.redirect('/');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});