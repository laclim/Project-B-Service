/**
 * Module dependencies.
 */

import { Schema, model, Model, Document } from "mongoose";
import { SchemaTimestampsConfig } from "mongoose";
import {} from "oauth2-server";
import { rejects } from "assert";
import { Profile } from "passport-facebook";
import config from "config";

/**
 * Schema definitions.
 */

const OAuthTokensSchema = new Schema({
  accessToken: { type: String },
  accessTokenExpiresAt: { type: Date },
  client: { type: Object }, // `client` and `user` are required in multiple places, for example `getAccessToken()`
  clientId: { type: String },
  refreshToken: { type: String },
  refreshTokenExpiresAt: { type: Date },
  user: { type: Object },
  userId: { type: String }
});

const OAuthClientsSchema = new Schema({
  clientId: { type: String },
  clientSecret: { type: String },
  type: { type: String, enum: ["USER", "OPS", "DEV"] },
  grants: { type: String },
  redirectUris: { type: Array }
});

const OAuthUsersSchema = new Schema(
  {
    email: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    userProfId: { type: String },
    password: { type: String },
    username: { type: String },
    facebook: new Schema(
      {
        facebookId: String,
        email: String,
        displayName: String,
        accessToken: String
      },
      { _id: false }
    )
  },
  { timestamps: true }
);

/* 

 interface


 */

interface IOAuthTokensSchema extends Document {
  accessToken: string;
  accessTokenExpiresAt: Date;
  client: IOAuthClientsSchema;
  clientId: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  user: IOAuthUsersSchema;
  userId: string;
}

interface IOAuthClientsSchema extends Document {
  clientId: string;
  clientSecret: string;
  type: "USER" | "OPS" | "DEV";
  grants: string;
  redirectUris: Array<string>;

  id: string; //unused
}

export interface IOAuthUsersSchema extends Document {
  email: string;
  firstname: string;
  lastname: string;
  userProfId: string;
  password: string;
  username: string;
  facebook: {
    facebookId: string;
    email: string;
    displayname: string;
    accessToken: string;
  };
}

interface IFacebookSchema extends Profile {
  facebookId: string;
  emails?: Array<{
    value: string;
    type?: string;
  }>;
  displayName: string;
}

var OAuthTokensModel = model<IOAuthTokensSchema>(
  "OAuthTokens",
  OAuthTokensSchema,
  "OAuthTokens"
);
var OAuthClientsModel = model<IOAuthClientsSchema>(
  "OAuthClients",
  OAuthClientsSchema,
  "OAuthClients"
);
var OAuthUsersModel = model<IOAuthUsersSchema>(
  "OAuthUsers",
  OAuthUsersSchema,
  "OAuthUsers"
);

export { OAuthTokensModel, OAuthClientsModel, OAuthUsersModel };

/**
 * Get access token.
 */

function getAccessToken(
  bearerToken: string
): Promise<false | "" | 0 | IOAuthTokensSchema | null | undefined> {
  // Adding `.lean()`, as we get a mongoose wrapper object back from `findOne(...)`, and oauth2-server complains.
  return new Promise((resolve, reject) => {
    OAuthTokensModel.findOne({ accessToken: bearerToken }, function(
      err,
      value
    ) {
      resolve(value);
      reject(err);
    }).lean();
  });
}

// /**
//  * Get client.
//  */

function getClient(
  clientId: string,
  clientSecret: string
): Promise<false | "" | 0 | IOAuthClientsSchema | null | undefined> {
  return new Promise((resolve, reject) => {
    OAuthClientsModel.findOne(
      {
        clientId: clientId,
        clientSecret: clientSecret
      },
      function(err, value) {
        resolve(value);
        reject(err);
      }
    ).lean();
  });
}

// /**
//  * Get refresh token.
//  */

function getRefreshToken(
  refreshToken: string,
  callback: (err: Error | null, value: Document | null) => void
) {
  return OAuthTokensModel.findOne({ refreshToken: refreshToken }, function(
    err,
    value
  ) {
    callback(err, value);
  }).lean();
}

// /**
//  * Get user.
//  */

function getUser(
  username: string,
  password: string
): Promise<false | "" | 0 | IOAuthUsersSchema | null | undefined> {
  return new Promise((resolve, reject) =>
    OAuthUsersModel.findOne(
      {
        username: username,
        password: password
      },
      function(err, value) {
        resolve(value);
        reject(err);
      }
    ).lean()
  );
}

// /**
//  * Save token.
//  */

function saveToken(
  token: IOAuthTokensSchema,
  client: IOAuthClientsSchema,

  user: IOAuthUsersSchema
): Promise<false | "" | 0 | IOAuthTokensSchema | null | undefined> {
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

    accessToken.save(function(err, data) {
      resolve(data);
      reject(err);
    });
  });
}

function grantTypeAllowed(
  clientID: string,
  grantType: string,
  callback: (err: Boolean | null, value: Boolean | null) => void
) {
  console.log(
    "grantTypeAllowed called and clientID is: ",
    clientID,
    " and grantType is: ",
    grantType
  );

  callback(false, true);
}

function verifyScope(
  accesToken: IOAuthTokensSchema,
  scope: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    resolve(true);
    reject(false);
  });
}

function revokeToken(token: IOAuthTokensSchema) {
  return new Promise((resolve, reject) => {
    OAuthTokensModel.deleteOne({ refreshToken: token.refreshToken })
      .then(refreshToken => {
        resolve(refreshToken);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export {
  getAccessToken,
  getClient,
  getRefreshToken,
  getUser,
  saveToken,
  grantTypeAllowed,
  verifyScope,
  revokeToken
};
