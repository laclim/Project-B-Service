import express from "express";
import * as winston from "winston";
import { logger, errorLogger } from "./middleware/logger";
// var logger = require("./middleware/logger");
import "./db";
import router from "./router/router";
import config from "config";
import bodyParser from "body-parser";
// config logger
import passport from "passport";

const app = express();
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger);
app.use("/", router);

app.use(errorLogger);
const PORT = config.get("PORT");
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
