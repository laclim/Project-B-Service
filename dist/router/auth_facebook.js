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
const passport_facebook_1 = require("passport-facebook");
const passport_1 = __importDefault(require("passport"));
var auth_facebook = express_1.default.Router();
const axios_1 = __importDefault(require("axios"));
const crypto_random_string_1 = __importDefault(require("crypto-random-string"));
const oauth_1 = require("../models/oauth");
const querystring_1 = require("querystring");
const account_1 = require("../models/account");
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ["emails"]
}, function (accessToken, refreshToken, profile, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield oauth_1.OAuthUsersModel.findOne({
                "facebook.facebookId": profile.id
            });
            if (!user) {
                const userProfile = yield account_1.UserProfileModel.create({ gender: "MALE" });
                const result = yield oauth_1.OAuthUsersModel.create({
                    username: crypto_random_string_1.default({ length: 15 }),
                    password: crypto_random_string_1.default({ length: 15 }),
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
            }
            else {
                return cb(null, user);
            }
        }
        catch (error) {
            return cb(error);
        }
        // await UserProfileModel.findOneAndUpdate({_id:OAuthUsersModel.f});
    });
}));
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
auth_facebook.get("/", passport_1.default.authenticate("facebook", {
    scope: ["email", "user_friends"]
}));
auth_facebook.get("/callback", passport_1.default.authenticate("facebook", {
    // successRedirect: "http://localhost:8000/",
    failureRedirect: "/login",
    session: false
}), function (req, res) {
    const user = req.user;
    // Successful authentication, redirect home.
    oauth_1.OAuthUsersModel.findOne({ "facebook.facebookId": user.facebook.facebookId }, (err, value) => {
        if (err)
            return;
        if (value) {
            const username = value.username;
            const password = value.password;
            getAccessTokenAfterPassport(username, password)
                .then((response) => {
                res.cookie("aT", response.accessToken);
                res.cookie("rT", response.refreshToken);
            })
                .then((response) => {
                res.redirect("http://localhost:8000/");
            })
                .catch(errResponse => res.json(errResponse));
        }
    });
});
function getAccessTokenAfterPassport(username, password) {
    const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        // data: qs.stringify(data),
        url: "http://localhost:3000/login",
        auth: {
            username: process.env.CLIENT_ID,
            password: process.env.CLIENT_SECRET
        },
        data: querystring_1.stringify({
            username: username,
            password: password
        })
    };
    return new Promise((resolve, reject) => axios_1.default(options)
        .then(response => {
        resolve(response.data);
    })
        .catch(err => {
        reject(err);
    }));
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
exports.default = auth_facebook;
//# sourceMappingURL=auth_facebook.js.map