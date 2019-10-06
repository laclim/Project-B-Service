"use strict";
/**
 * Module dependencies.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * Schema definitions.
 */
const OAuthTokensSchema = new mongoose_1.Schema({
    accessToken: { type: String },
    accessTokenExpiresAt: { type: Date },
    client: { type: Object },
    clientId: { type: String },
    refreshToken: { type: String },
    refreshTokenExpiresAt: { type: Date },
    user: { type: Object },
    userId: { type: String }
});
const OAuthClientsSchema = new mongoose_1.Schema({
    clientId: { type: String },
    clientSecret: { type: String },
    grants: { type: String },
    redirectUris: { type: Array }
});
const OAuthUsersSchema = new mongoose_1.Schema({
    email: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String },
    username: { type: String },
    facebook: new mongoose_1.Schema({
        facebookId: String,
        email: String,
        displayName: String,
        accessToken: String
    }, { _id: false })
}, { timestamps: true });
var OAuthTokensModel = mongoose_1.model("OAuthTokens", OAuthTokensSchema, "OAuthTokens");
exports.OAuthTokensModel = OAuthTokensModel;
var OAuthClientsModel = mongoose_1.model("OAuthClients", OAuthClientsSchema, "OAuthClients");
exports.OAuthClientsModel = OAuthClientsModel;
var OAuthUsersModel = mongoose_1.model("OAuthUsers", OAuthUsersSchema, "OAuthUsers");
exports.OAuthUsersModel = OAuthUsersModel;
/**
 * Get access token.
 */
function getAccessToken(bearerToken) {
    // Adding `.lean()`, as we get a mongoose wrapper object back from `findOne(...)`, and oauth2-server complains.
    return new Promise((resolve, reject) => {
        OAuthTokensModel.findOne({ accessToken: bearerToken }, function (err, value) {
            resolve(value);
            reject(err);
        }).lean();
    });
}
exports.getAccessToken = getAccessToken;
// /**
//  * Get client.
//  */
function getClient(clientId, clientSecret) {
    return new Promise((resolve, reject) => {
        OAuthClientsModel.findOne({
            clientId: clientId,
            clientSecret: clientSecret
        }, function (err, value) {
            resolve(value);
            reject(err);
        }).lean();
    });
}
exports.getClient = getClient;
// /**
//  * Get refresh token.
//  */
function getRefreshToken(refreshToken, callback) {
    return OAuthTokensModel.findOne({ refreshToken: refreshToken }, function (err, value) {
        callback(err, value);
    }).lean();
}
exports.getRefreshToken = getRefreshToken;
// /**
//  * Get user.
//  */
function getUser(username, password) {
    return new Promise((resolve, reject) => OAuthUsersModel.findOne({
        username: username,
        password: password
    }, function (err, value) {
        resolve(value);
        reject(err);
    }).lean());
}
exports.getUser = getUser;
// /**
//  * Save token.
//  */
function saveToken(token, client, user) {
    return new Promise((resolve, reject) => {
        var accessToken = new OAuthTokensModel({
            accessToken: token.accessToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            refreshToken: token.refreshToken,
            refreshTokenExpiresAt: token.refreshTokenExpiresAt,
            client: client,
            clientId: client.clientId,
            user: user,
            userId: user._id
        });
        // Can't just chain `lean()` to `save()` as we did with `findOne()` elsewhere. Instead we use `Promise` to resolve the data.
        accessToken.save(function (err, data) {
            resolve(data);
            reject(err);
        });
    });
}
exports.saveToken = saveToken;
function grantTypeAllowed(clientID, grantType, callback) {
    console.log("grantTypeAllowed called and clientID is: ", clientID, " and grantType is: ", grantType);
    callback(false, true);
}
exports.grantTypeAllowed = grantTypeAllowed;
function verifyScope(accesToken, scope) {
    return new Promise((resolve, reject) => {
        resolve(true);
        reject(false);
    });
}
exports.verifyScope = verifyScope;
//# sourceMappingURL=oauth.js.map