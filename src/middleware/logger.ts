import * as winstonExpress from "express-winston";
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

export const logger = winstonExpress.logger({
  transports: logTransportList,
  expressFormat: true,
  level: "info",
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  requestWhitelist: ["body", "headers"], // Array of request properties to log. Overrides global requestWhitelist for this instance
  responseWhitelist: ["body", "headers"] // Array of response properties to log. Overrides global responseWhitelist for this instance
});

export const errorLogger = winstonExpress.errorLogger({
  transports: logTransportList,

  level: "error",

  msg: "HTTP {{req.method}} {{req.url}}",
  requestWhitelist: ["body", "headers"] // Array of request properties to log. Overrides global requestWhitelist for this instance
});

// export = { logger, errorLogger };
// export function run() {
//   console.log("run");
// }
