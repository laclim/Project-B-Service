import express from "express";
import * as winston from "winston";
import { logger, errorLogger } from "./middleware/logger";
// var logger = require("./middleware/logger");
import "./db";
import router from "./router/router";
import cookieParser from "cookie-parser";
import session from "express-session";
import bodyParser from "body-parser";
// config logger
import passport from "passport";
import cors from "cors";
import connectMongo from "connect-mongo";
const MongoStore = connectMongo(session);

const app = express();
app.use(
  cors({
    origin: "http://localhost:8000/", // allow to server to accept request from different origin
    credentials: true // allow session cookie from browser to pass through
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(
  session({
    store: new MongoStore({ url: process.env.MONGO_URL }),
    name: "user_sid",
    secret: "somerandonstuffs",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000
    }
  })
);

app.use(bodyParser.json());
app.use(logger);
app.use("/", router);

console.log(process.env.TEST);
app.use(errorLogger);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
