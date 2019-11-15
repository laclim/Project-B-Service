import OAuth2Server from "oauth2-server";
import { Request, Response } from "oauth2-server";
import api from "./api/api";
import * as oAuthModel from "../models/oauth";
import { OAuthClientsModel } from "../models/oauth";
import express from "express";
var oauth = new OAuth2Server({
  model: oAuthModel,
  refreshTokenLifetime: 60 * 60 * 24 * 30
});

export function authenticateHandler(options: any) {
  return function(req: express.Request, res: express.Response, next: any) {
    let request = new Request(req);
    let response = new Response(res);
    return oauth
      .authenticate(request, response, options)
      .then(function(token) {
        res.locals.oauth = { token: token };
        req.headers.userId = token.userId;
        next();
      })
      .catch(function(err) {
        if (err.message == "Invalid token: access token has expired")
          res.status(401).json({ message: "token expired" });
        else res.status(401).json(err);
      });
  };
}

export function authoriseHandler(options: any) {
  return async function(
    req: express.Request,
    res: express.Response,
    next: any
  ) {
    req.body.grant_type = options.grant_type;
    let request = new Request(req);
    let response = new Response(res);

    try {
      const basic = new Buffer(
        req.headers.authorization.split(" ")[1],
        "base64"
      ).toString();
      const clientId = basic.split(":")[0];
      const client = await OAuthClientsModel.findOne({ clientId: clientId });

      if (client.type == "USER") {
        return oauth
          .token(request, response, options)
          .then(response => {
            res.status(200).json(response);
            next();
          })
          .catch(function(err) {
            res.status(500).json(err);
          });
      } else {
        res.status(403).json({ message: "You are not user" });
      }
    } catch (error) {
      res.status(403).json({ message: "Invalid client" });
    }
  };
}

var login = express.Router();

login.post("/login", authoriseHandler({ grant_type: "password" }));

login.post("/refresh", authoriseHandler({ grant_type: "refresh_token" }));

login.use("/api", authenticateHandler({}), api);

export default login;
