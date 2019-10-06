"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_1 = __importDefault(require("../models/account"));
const utility_1 = require("./utility");
const express_validator_1 = require("express-validator");
var auth = express_1.default.Router();
auth.post("/registerUser", [express_validator_1.check("email").isEmail(), express_validator_1.check("password").isLength({ min: 5 })], registerUser);
function registerUser(req, res) {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        utility_1.sendResponse(res.status(422), "bad request", errors.array());
    }
    console.log(`authRoutesMethods: registerUser: req.body is:`, req.body);
    account_1.default.count({ email: req.body.email }, function (err, count) {
        if (count > 0) {
            utility_1.sendResponse(res, "email exist", err);
            return;
        }
        //register the user in the db
        var newAccount = new account_1.default();
        newAccount.email = req.body.email;
        newAccount.password = req.body.password;
        newAccount.save(function (err, value) {
            if (err)
                utility_1.sendResponse(res, "create fail", err);
            res.json(value);
        });
        utility_1.sendResponse(res, "user created", err);
    });
}
exports.default = auth;
//# sourceMappingURL=auth.js.map