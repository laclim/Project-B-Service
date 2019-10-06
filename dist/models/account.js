"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AccountSchema = new mongoose_1.Schema({
    facebookId: { type: String, unique: true },
    facebookToken: { type: String },
    facebookDisplayName: { type: String },
    email: { type: String, unique: true },
    password: { type: String }
});
const Account = mongoose_1.model("Account", AccountSchema);
exports.default = Account;
//# sourceMappingURL=account.js.map