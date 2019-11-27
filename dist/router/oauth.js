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
const api_1 = __importDefault(require("./api/api"));
const oAuthModel = __importStar(require("../models/oauth"));
const oauth_1 = require("../models/oauth");
const express_1 = __importDefault(require("express"));
var oauth = new oauth2_server_1.default({
    model: oAuthModel,
    refreshTokenLifetime: Number(process.env.REFRESH_TOKEN_EXPIRE)
});
function authenticateHandler(options) {
    return function (req, res, next) {
        let request = new oauth2_server_2.Request(req);
        let response = new oauth2_server_2.Response(res);
        return oauth
            .authenticate(request, response, options)
            .then(function (token) {
            req.session.accessToken = token.accessToken;
            req.session.refreshToken = token.refreshToken;
            next();
        })
            .catch(function (err) {
            if (err.status != 200) {
                // req.session.destroy(sessionError => {
                //   if (sessionError) {
                //     res.status(400).json({ message: sessionError });
                //   }
                // });
                res.status(401).json({ message: err.message });
            }
            else
                res.status(401).json(err);
        });
    };
}
exports.authenticateHandler = authenticateHandler;
function authoriseHandler(options) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.grant_type = options.grant_type;
            let request = new oauth2_server_2.Request(req);
            let response = new oauth2_server_2.Response(res);
            try {
                const basic = new Buffer(req.headers.authorization.split(" ")[1], "base64").toString();
                const clientId = basic.split(":")[0];
                const client = yield oauth_1.OAuthClientsModel.findOne({ clientId: clientId });
                if (client.type == "USER") {
                    return oauth
                        .token(request, response, options)
                        .then(response => {
                        res.status(200).json(response);
                        next();
                    })
                        .catch(function (err) {
                        res.status(500).json(err);
                    });
                }
                else {
                    res.status(403).json({ message: "You are not user" });
                }
            }
            catch (error) {
                res.status(403).json({ error });
            }
        });
    };
}
exports.authoriseHandler = authoriseHandler;
var login = express_1.default.Router();
login.post("/login", authoriseHandler({ grant_type: "password" }));
login.post("/refresh", authoriseHandler({ grant_type: "refresh_token" }));
login.get("/user", authenticateHandler({}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session) {
        res.status(400).json({ message: "no user" });
    }
    res.json({ message: req.session.user_id });
}));
login.delete("/logout", authenticateHandler({}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.headers.authorization.split(" ")[1];
    try {
        const deleteToken = yield oauth_1.OAuthTokensModel.deleteOne({
            accessToken: accessToken
        });
        // req.session.destroy(err => {
        //   if (err) res.status(400).json({ message: "destroy session failed" });
        res.json({
            message: "revoke token successful",
            count: deleteToken.deletedCount
        });
        // });
    }
    catch (error) {
        res.status(400).json({ message: "not id found" });
    }
}));
login.use("/api", authenticateHandler({}), api_1.default);
exports.default = login;
//# sourceMappingURL=oauth.js.map