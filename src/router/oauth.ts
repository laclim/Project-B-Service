import OAuth2Server from "oauth2-server";
import { Request, Response } from "oauth2-server";

import * as oAuthModel from "../models/oauth";
import express from "express";
var oauth = new OAuth2Server({
  model: oAuthModel
});

export function authenticateHandler(options: any) {
  return function(req: express.Request, res: express.Response, next: any) {
    let request = new Request(req);
    let response = new Response(res);
    return oauth
      .authenticate(request, response, options)
      .then(function(token) {
        res.locals.oauth = { token: token };
        next();
      })
      .catch(function(err) {
        res.json(err);
      });
  };
}

export function authoriseHandler(options: any) {
  return function(req: express.Request, res: express.Response, next: any) {
    let request = new Request(req);
    let response = new Response(res);
    return oauth
      .token(request, response, options)
      .then(function(token) {
        res.json(token);

        next();
      })
      .catch(function(err) {
        res.json(err);
      });
  };
}

var login = express.Router();

login.post("/login", authoriseHandler({}));

login.get("/restricted", authenticateHandler({}), (req, res) => {
  res.json("successfull");
});

export default login;
