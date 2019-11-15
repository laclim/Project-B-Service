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
const UserProfileSchema = new mongoose_1.Schema({
    gender: { type: String, enum: ["MALE", "FEMALE"], required: true },
    likes: { type: Number, default: 0 },
    vipStatus: { type: Number, default: 0 }
});
const Account = mongoose_1.model("Account", AccountSchema);
const UserProfileModel = mongoose_1.model("UserProfile", UserProfileSchema);
exports.UserProfileModel = UserProfileModel;
//# sourceMappingURL=account.js.map