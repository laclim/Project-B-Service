import express from "express";

import { sendResponse } from "./utility";
import { check, validationResult } from "express-validator";
import { OAuthUsersModel } from "../models/oauth";

var auth = express.Router();

auth.post(
  "/registerUser",
  [check("email").isEmail(), check("password").isLength({ min: 5 })],
  registerUser
);

function registerUser(req: express.Request, res: express.Response) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    sendResponse(res, "bad request", errors);
  } else {
    console.log(`authRoutesMethods: registerUser: req.body is:`, req.body);
    OAuthUsersModel.count({ email: req.body.email }, function(err, count) {
      if (count > 0) {
        sendResponse(res, "email exist", err);
        return;
      }

      //register the user in the db
    });
    var newAccount = new OAuthUsersModel();
    newAccount.email = req.body.email;
    newAccount.password = req.body.password;
    newAccount.save(function(err, value) {
      if (err) sendResponse(res, "create fail", err);

      sendResponse(res, "user created", err);
    });
  }
}

export default auth;
