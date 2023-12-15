"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var passport_1 = __importDefault(require("passport"));
var router = express_1.default.Router();
// Routes
router.get('', function (req, res) {
    res.send('Home page');
});
router.get('/error', function (req, res) {
    res.send('Error page');
});
router.post('/signup', passport_1.default.authenticate('local-signup', {
    successRedirect: '/signup/success',
    failureRedirect: '/signup/failure'
}));
// connexion
router.post('/login', passport_1.default.authenticate('local-login', {
    successRedirect: '/login/success',
    failureRedirect: '/login/failure',
}));
router.get('/signup/success', function (req, res) {
    res.send('Registration successful');
});
router.get('/signup/failure', function (req, res) {
    res.send('Failure during the registration');
});
router.get('/login/success', function (req, res) {
    res.send('Login successful');
});
router.get('/login/failure', function (req, res) {
    res.send('Failure during login');
});
// middleware for authentication
var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};
router.get('/user', ensureAuthenticated, function (req, res) {
    res.send('Welcome on the user page');
});
router.delete('/logout', function (req, res) {
    req.logOut();
    res.redirect('/');
});
exports.default = router;
