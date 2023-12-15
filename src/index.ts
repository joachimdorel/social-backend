import express from 'express';
import session from 'express-session';
import router from './routes';
import passport from 'passport';

require('./auth/passport');

const app = express();

app.use(express.json());
// TODO add secret key here
app.use(session({ 
  secret: 'secretKey', 
  resave: false, 
  saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());

// headers to allow Cross Origin Requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  next();
});


//  Connect all our routes to our application
app.use('/', router);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});