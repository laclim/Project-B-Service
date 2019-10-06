import express, { response } from "express";
import { Strategy } from "passport-facebook";
import passport from "passport";
import config from "config";
// import Account, { IAccount } from "../models/account";
import { sendResponse } from "./utility";
var auth_facebook = express.Router();
import { authenticateHandler, authoriseHandler } from "./oauth";
import axios from "axios";
import { AxiosRequestConfig } from "axios";
import cryptoRandomString from "crypto-random-string";
import { OAuthUsersModel, IOAuthUsersSchema } from "../models/oauth";
import { stringify } from "querystring";

passport.use(
  new Strategy(
    {
      clientID: config.get("CLIENT_ID"),
      clientSecret: config.get("CLIENT_SECRET"),
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["emails"]
    },
    function(accessToken, refreshToken, profile, cb) {
      OAuthUsersModel.findOneAndUpdate(
        { "facebook.facebookId": profile.id },
        {
          username: cryptoRandomString({ length: 15 }),
          password: cryptoRandomString({ length: 15 }),
          email: profile.emails[0].value,
          facebook: {
            facebookId: profile.id,
            email: profile.emails[0].value,
            displayName: profile.displayName,
            accessToken: accessToken
          }
        },
        { upsert: true },
        (err, value) => {
          if (err) return cb(err);
          return cb(null, value);
        }
      );
    }
  )
);

auth_facebook.get(
  "/",
  passport.authenticate("facebook", {
    scope: ["email", "user_friends"]
  })
);

auth_facebook.get(
  "/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false
  }),
  function(req, res) {
    const user = req.user as IOAuthUsersSchema;
    // Successful authentication, redirect home.
    OAuthUsersModel.findOne(
      { "facebook.facebookId": user.facebook.facebookId },
      (err, value) => {
        if (err) return;
        if (value) {
          const username = value.username;
          const password = value.password;
          getAccessTokenAfterPassport(username, password)
            .then(response => res.json(response))
            .catch(errResponse => res.json(errResponse));
        }
      }
    );

    // res.redirect("/");
  }
);

function getAccessTokenAfterPassport(username: string, password: string) {
  const options: AxiosRequestConfig = {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    // data: qs.stringify(data),
    url: "http://localhost:3000/login",
    auth: {
      username: "dev",
      password: "dev"
    },
    data: stringify({
      username: username,
      password: password,
      grant_type: "password"
    })
  };
  return new Promise((resolve, reject) =>
    axios(options)
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      })
  );
}
auth_facebook.get("/success", function(req, res) {
  const options: AxiosRequestConfig = {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    auth: {
      username: config.get("CLIENT_ID"),
      password: config.get("CLIENT_SECRET")
    },

    // data: qs.stringify(data),
    url: "http://localhost:3000/login"
  };
  axios(options)
    .then(response => {
      res.json(response.data);
    })
    .catch(err => {
      res.json(err);
    });
});

export default auth_facebook;
