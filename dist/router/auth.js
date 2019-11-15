"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utility_1 = require("./utility");
const express_validator_1 = require("express-validator");
const oauth_1 = require("../models/oauth");
var auth = express_1.default.Router();
auth.post("/registerUser", [express_validator_1.check("email").isEmail(), express_validator_1.check("password").isLength({ min: 5 })], registerUser);
function registerUser(req, res) {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        utility_1.sendResponse(res, "bad request", errors);
    }
    else {
        console.log(`authRoutesMethods: registerUser: req.body is:`, req.body);
        oauth_1.OAuthUsersModel.count({ email: req.body.email }, function (err, count) {
            if (count > 0) {
                utility_1.sendResponse(res, "email exist", err);
                return;
            }
            //register the user in the db
        });
        var newAccount = new oauth_1.OAuthUsersModel();
        newAccount.email = req.body.email;
        newAccount.password = req.body.password;
        newAccount.save(function (err, value) {
            if (err)
                utility_1.sendResponse(res, "create fail", err);
            utility_1.sendResponse(res, "user created", err);
        });
    }
}
exports.default = auth;
//# sourceMappingURL=auth.js.map