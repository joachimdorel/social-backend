import express from 'express';
import passport from 'passport';

const router = express.Router();

import { Pool } from 'pg';

// Routes
router.get('', async (req, res) => {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER
  });

  res.send('Home page');
});

router.get('/error', (req, res) => {
  res.send('Error page');
});

router.post(
  '/signup', 
  passport.authenticate('local-signup', { 
    successRedirect: '/signup/success', 
    failureRedirect: '/signup/failure'
  })
);

// connexion
router.post(
  '/login', 
  passport.authenticate('local-login', {
    successRedirect: '/login/success',
    failureRedirect: '/login/failure',
  })
);

router.get('/signup/success', (req, res) => {
  res.send('Registration successful')
});

router.get('/signup/failure', (req, res) => {
  res.send('Failure during the registration');
});

router.get('/login/success', (req, res) => {
  res.send('Login successful');
});

router.get('/login/failure', (req, res) => {
  res.send('Failure during login');
});

// middleware for authentication
const ensureAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

router.get('/user', ensureAuthenticated, (req, res) => {
  res.send('Welcome on the user page');
});

router.delete('/logout', (req: any, res: any) => {
  req.logOut();
  res.redirect('/');
});

export default router;