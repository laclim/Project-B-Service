"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = require("./middleware/logger");
// var logger = require("./middleware/logger");
require("./db");
const router_1 = __importDefault(require("./router/router"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
// config logger
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const MongoStore = connect_mongo_1.default(express_session_1.default);
const app = express_1.default();
app.use(cors_1.default({
    origin: "http://localhost:8000/",
    credentials: true // allow session cookie from browser to pass through
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
// initialize express-session to allow us track the logged-in user across sessions.
app.use(express_session_1.default({
    store: new MongoStore({ url: process.env.MONGO_URL }),
    name: "user_sid",
    secret: "somerandonstuffs",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000
    }
}));
app.use(body_parser_1.default.json());
app.use(logger_1.logger);
app.use("/", router_1.default);
console.log(process.env.TEST);
app.use(logger_1.errorLogger);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map