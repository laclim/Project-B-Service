"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_facebook_1 = require("passport-facebook");
const passport_1 = __importDefault(require("passport"));
const config_1 = __importDefault(require("config"));
var auth_facebook = express_1.default.Router();
const axios_1 = __importDefault(require("axios"));
const crypto_random_string_1 = __importDefault(require("crypto-random-string"));
const oauth_1 = require("../models/oauth");
const querystring_1 = require("querystring");
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: config_1.default.get("CLIENT_ID"),
    clientSecret: config_1.default.get("CLIENT_SECRET"),
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ["emails"]
}, function (accessToken, refreshToken, profile, cb) {
    oauth_1.OAuthUsersModel.findOneAndUpdate({ "facebook.facebookId": profile.id }, {
        username: crypto_random_string_1.default({ length: 15 }),
        password: crypto_random_string_1.default({ length: 15 }),
        email: profile.emails[0].value,
        facebook: {
            facebookId: profile.id,
            email: profile.emails[0].value,
            displayName: profile.displayName,
            accessToken: accessToken
        }
    }, { upsert: true }, (err, value) => {
        if (err)
            return cb(err);
        return cb(null, value);
    });
}));
auth_facebook.get("/", passport_1.default.authenticate("facebook", {
    scope: ["email", "user_friends"]
}));
auth_facebook.get("/callback", passport_1.default.authenticate("facebook", {
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
                .then(response => res.json(response))
                .catch(errResponse => res.json(errResponse));
        }
    });
    // res.redirect("/");
});
function getAccessTokenAfterPassport(username, password) {
    const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        // data: qs.stringify(data),
        url: "http://localhost:3000/login",
        auth: {
            username: "dev",
            password: "dev"
        },
        data: querystring_1.stringify({
            username: username,
            password: password,
            grant_type: "password"
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
auth_facebook.get("/success", function (req, res) {
    const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        auth: {
            username: config_1.default.get("CLIENT_ID"),
            password: config_1.default.get("CLIENT_SECRET")
        },
        // data: qs.stringify(data),
        url: "http://localhost:3000/login"
    };
    axios_1.default(options)
        .then(response => {
        res.json(response.data);
    })
        .catch(err => {
        res.json(err);
    });
});
exports.default = auth_facebook;
//# sourceMappingURL=auth_facebook.js.map