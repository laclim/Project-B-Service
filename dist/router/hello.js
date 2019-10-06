"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
var hello = express_1.default.Router();
hello.get("/hello", (req, res) => {
    res.send("Hello World");
});
module.exports = hello;
//# sourceMappingURL=hello.js.map