"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const passport_local_1 = require("passport-local");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Simulate a user db with an array
const users = [];
const app = (0, express_1.default)();
app.use(express_1.default.json());
// TODO add secret key here
app.use((0, express_session_1.default)({ secret: 'secretKey', resave: false, saveUninitialized: false }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Passport
// Passsport strategy for inscription
passport_1.default.use('local-signup', new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        // check if the user already exist
        const user = users.find(user => user.email === email);
        if (user) {
            return done(null, false, { message: 'Email already used.' });
        }
        // hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // creation of the user
        const newUser = {
            id: Date.now().toString(),
            email: email,
            password: hashedPassword
        };
        users.push(newUser);
        return done(null, newUser);
    });
}));
// Passport strategy for connexion
passport_1.default.use('local-login', new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    const user = users.find(user => user.email === email);
    if (!user) {
        return done(null, false, { message: 'User not found' });
    }
    bcrypt_1.default.compare(password, user.password, (err, isMatch) => {
        if (err) {
            return done(err);
        }
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
    });
}));
passport_1.default.serializeUser((user, done) => {
    // serialize the user in the session
    // serialize: only keep an id to track the user
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => {
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
app.post('/signup', passport_1.default.authenticate('local-signup', {
    successRedirect: '/signup/success',
    failureRedirect: '/signup/failure'
}));
// connexion
app.post('/login', passport_1.default.authenticate('local-login', {
    successRedirect: '/login/success',
    failureRedirect: '/login/failure',
}));
app.get('/signup/success', (req, res) => {
    res.send('Registration successful');
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
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};
app.get('/user', ensureAuthenticated, (req, res) => {
    res.send('Welcome on the user page');
});
app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
