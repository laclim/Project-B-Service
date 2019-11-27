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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_1 = require("../../../models/account");
const express_validator_1 = require("express-validator");
const user = express_1.default.Router();
user.put("/user/:id", [
    express_validator_1.check("gender")
        .not()
        .isEmpty()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new account_1.UserProfileModel();
    user.gender = req.body.gender;
    try {
        yield user.collection.findOneAndUpdate({ _id: req.params.id }, req.body);
        res.json({ message: "update succesful" });
    }
    catch (error) {
        res.status(400).json(error);
    }
}));
user.get("/user/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: "Hello" });
}));
exports.default = user;
//# sourceMappingURL=user.js.map