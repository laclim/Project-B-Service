"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("config"));
mongoose_1.connect(config_1.default.get("MONGO_URL"), { useUnifiedTopology: true });
mongoose_1.connection.on("connected", function () {
    console.log("Mongo Connected");
});
mongoose_1.connection.on("disconnected", function () {
    console.log("Mongo Disonnected");
});
mongoose_1.connection.on("error", function () {
    console.log("Mongo Error");
});
//# sourceMappingURL=db.js.map