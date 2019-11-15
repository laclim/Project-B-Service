"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./logic/user"));
const api = express_1.default.Router();
api.use("/", user_1.default);
exports.default = api;
//# sourceMappingURL=api.js.map