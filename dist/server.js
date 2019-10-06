"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = require("./middleware/logger");
// var logger = require("./middleware/logger");
require("./db");
const router_1 = __importDefault(require("./router/router"));
const config_1 = __importDefault(require("config"));
const body_parser_1 = __importDefault(require("body-parser"));
// config logger
const passport_1 = __importDefault(require("passport"));
const app = express_1.default();
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(logger_1.logger);
app.use("/", router_1.default);
app.use(logger_1.errorLogger);
const PORT = config_1.default.get("PORT");
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map