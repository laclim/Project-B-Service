"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const oauth2_server_1 = __importDefault(require("oauth2-server"));
const oauth2_server_2 = require("oauth2-server");
const oAuthModel = __importStar(require("../models/oauth"));
const express_1 = __importDefault(require("express"));
var oauth = new oauth2_server_1.default({
    model: oAuthModel
});
function authenticateHandler(options) {
    return function (req, res, next) {
        let request = new oauth2_server_2.Request(req);
        let response = new oauth2_server_2.Response(res);
        return oauth
            .authenticate(request, response, options)
            .then(function (token) {
            res.locals.oauth = { token: token };
            next();
        })
            .catch(function (err) {
            res.json(err);
        });
    };
}
exports.authenticateHandler = authenticateHandler;
function authoriseHandler(options) {
    return function (req, res, next) {
        let request = new oauth2_server_2.Request(req);
        let response = new oauth2_server_2.Response(res);
        return oauth
            .token(request, response, options)
            .then(function (token) {
            res.json(token);
            next();
        })
            .catch(function (err) {
            res.json(err);
        });
    };
}
exports.authoriseHandler = authoriseHandler;
var login = express_1.default.Router();
login.post("/login", authoriseHandler({}));
login.get("/restricted", authenticateHandler({}), (req, res) => {
    res.json("successfull");
});
exports.default = login;
//# sourceMappingURL=oauth.js.map