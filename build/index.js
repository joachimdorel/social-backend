"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_session_1 = __importDefault(require("express-session"));
var routes_1 = __importDefault(require("./routes"));
var passport_1 = __importDefault(require("passport"));
require('./auth/passport');
var app = (0, express_1.default)();
app.use(express_1.default.json());
// TODO add secret key here
app.use((0, express_session_1.default)({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// headers to allow Cross Origin Requests
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    next();
});
//  Connect all our routes to our application
app.use('/', routes_1.default);
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});
