import express from 'express';
import session from 'express-session';
import passport from 'passport';

import router from './routes';
import pool from './utils/pgPool'

require('dotenv').config()

require('./auth/passport')(passport);

const app = express();

app.use(express.json());

// TODO add secret key here
app.use(session({ 
  secret: String(process.env.SECRET_KEY), 
  resave: false, 
  saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());

// headers to allow Cross Origin Requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  next();
});

//  Connect all our routes to our application
app.use('/', router);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

process.on('SIGTERM', async () => {
  server.close(async () => {
    // closing ressources
    await pool.end();
  });
});