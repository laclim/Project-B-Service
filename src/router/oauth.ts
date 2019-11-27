import OAuth2Server from "oauth2-server";
import { Request, Response } from "oauth2-server";
import api from "./api/api";
import * as oAuthModel from "../models/oauth";
import { OAuthClientsModel, OAuthTokensModel } from "../models/oauth";
import express from "express";
import session from "express-session";

var oauth = new OAuth2Server({
  model: oAuthModel,
  refreshTokenLifetime: Number(process.env.REFRESH_TOKEN_EXPIRE)
});

export function authenticateHandler(options: any) {
  return function(req: express.Request, res: express.Response, next: any) {
    let request = new Request(req);
    let response = new Response(res);

    return oauth
      .authenticate(request, response, options)
      .then(function(token) {
        req.session.accessToken = token.accessToken;
        req.session.refreshToken = token.refreshToken;
        next();
      })
      .catch(function(err) {
        if (err.status != 200) {
          // req.session.destroy(sessionError => {
          //   if (sessionError) {
          //     res.status(400).json({ message: sessionError });
          //   }
          // });

          res.status(401).json({ message: err.message });
        } else res.status(401).json(err);
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
      res.status(403).json({ error });
    }
  };
}

var login = express.Router();

login.post("/login", authoriseHandler({ grant_type: "password" }));

login.post("/refresh", authoriseHandler({ grant_type: "refresh_token" }));

login.get("/user", authenticateHandler({}), async (req, res) => {
  if (!req.session) {
    res.status(400).json({ message: "no user" });
  }
  res.json({ message: req.session.user_id });
});

login.delete("/logout", authenticateHandler({}), async (req, res) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  try {
    const deleteToken = await OAuthTokensModel.deleteOne({
      accessToken: accessToken
    });

    // req.session.destroy(err => {
    //   if (err) res.status(400).json({ message: "destroy session failed" });
    res.json({
      message: "revoke token successful",
      count: deleteToken.deletedCount
    });
    // });
  } catch (error) {
    res.status(400).json({ message: "not id found" });
  }
});

login.use("/api", authenticateHandler({}), api);

export default login;
