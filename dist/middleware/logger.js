"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const winstonExpress = __importStar(require("express-winston"));
var MongoDB = require("winston-mongodb").MongoDB;
const logTransportList = [
    new MongoDB({
        db: process.env.LOGGER_URL,
        collection: "api-log",
        handleExceptions: true,
        level: "info",
        metaKey: "meta"
    })
];
exports.logger = winstonExpress.logger({
    transports: logTransportList,
    expressFormat: true,
    level: "info",
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    requestWhitelist: ["body", "headers"],
    responseWhitelist: ["body", "headers"] // Array of response properties to log. Overrides global responseWhitelist for this instance
});
exports.errorLogger = winstonExpress.errorLogger({
    transports: logTransportList,
    level: "error",
    msg: "HTTP {{req.method}} {{req.url}}",
    requestWhitelist: ["body", "headers"] // Array of request properties to log. Overrides global requestWhitelist for this instance
});
// export = { logger, errorLogger };
// export function run() {
//   console.log("run");
// }
//# sourceMappingURL=logger.js.map