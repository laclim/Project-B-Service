import express from "express";
import { Strategy } from "passport-facebook";
import passport from "passport";
import config from "config";

import Account from "../models/account";
import { sendResponse } from "./utility";
import { check, validationResult } from "express-validator";

var auth = express.Router();

auth.post(
  "/registerUser",
  [check("email").isEmail(), check("password").isLength({ min: 5 })],
  registerUser
);

function registerUser(req: express.Request, res: express.Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendResponse(res.status(422), "bad request", errors.array());
  }
  console.log(`authRoutesMethods: registerUser: req.body is:`, req.body);
  Account.count({ email: req.body.email }, function(err, count) {
    if (count > 0) {
      sendResponse(res, "email exist", err);
      return;
    }

    //register the user in the db
    var newAccount = new Account();
    newAccount.email = req.body.email;
    newAccount.password = req.body.password;
    newAccount.save(function(err, value) {
      if (err) sendResponse(res, "create fail", err);
      res.json(value);
    });

    sendResponse(res, "user created", err);
  });
}

export default auth;
