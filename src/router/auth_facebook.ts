import express, { response } from "express";
import { Strategy } from "passport-facebook";
import passport from "passport";
import { sendResponse } from "./utility";
var auth_facebook = express.Router();
import { authenticateHandler, authoriseHandler } from "./oauth";
import axios from "axios";
import { AxiosRequestConfig } from "axios";
import cryptoRandomString from "crypto-random-string";
import { OAuthUsersModel, IOAuthUsersSchema } from "../models/oauth";
import { stringify } from "querystring";
import { UserProfileModel } from "../models/account";
import cookieParser from "cookie-parser";

passport.use(
  new Strategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["emails"]
    },
    async function(accessToken, refreshToken, profile, cb) {
      try {
        const user = await OAuthUsersModel.findOne({
          "facebook.facebookId": profile.id
        });

        if (!user) {
          const userProfile = await UserProfileModel.create({ gender: "MALE" });

          const result = await OAuthUsersModel.create({
            username: cryptoRandomString({ length: 15 }),
            password: cryptoRandomString({ length: 15 }),
            email: profile.emails[0].value,
            facebook: {
              facebookId: profile.id,
              email: profile.emails[0].value,
              displayName: profile.displayName,
              accessToken: accessToken
            },
            userProfId: userProfile._id
          });
          return cb(null, result);
        } else {
          return cb(null, user);
        }
      } catch (error) {
        return cb(error);
      }

      // await UserProfileModel.findOneAndUpdate({_id:OAuthUsersModel.f});
    }
  )
);
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

auth_facebook.get(
  "/",
  passport.authenticate("facebook", {
    scope: ["email", "user_friends"]
  })
);

auth_facebook.get(
  "/callback",
  passport.authenticate("facebook", {
    // successRedirect: "http://localhost:8000/",
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
            .then((response: any) => {
              res.cookie("aT", response.accessToken);
              res.cookie("rT", response.refreshToken);
            })
            .then((response: any) => {
              res.redirect("http://localhost:8000/");
            })
            .catch(errResponse => res.json(errResponse));
        }
      }
    );
  }
);

function getAccessTokenAfterPassport(username: string, password: string) {
  const options: AxiosRequestConfig = {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    // data: qs.stringify(data),
    url: "http://localhost:3000/login",
    auth: {
      username: process.env.CLIENT_ID,
      password: process.env.CLIENT_SECRET
    },
    data: stringify({
      username: username,
      password: password
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
// auth_facebook.get("/success", function(req, res) {
//   const options: AxiosRequestConfig = {
//     method: "POST",
//     headers: { "content-type": "application/x-www-form-urlencoded" },
//     auth: {
//       username: config.get("CLIENT_ID"),
//       password: config.get("CLIENT_SECRET")
//     },

//     // data: qs.stringify(data),
//     url: "http://localhost:3000/login"
//   };
//   axios(options)
//     .then(response => {
//       res.json(response.data);
//     })
//     .catch(err => {
//       res.json(err);
//     });
// });

export default auth_facebook;
