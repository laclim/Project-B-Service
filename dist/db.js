"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
mongoose_1.connect(process.env.MONGO_URL, { useUnifiedTopology: true });
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