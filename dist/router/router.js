"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_facebook_1 = __importDefault(require("./auth_facebook"));
const auth_1 = __importDefault(require("./auth"));
const oauth_1 = __importDefault(require("./oauth"));
var router = express_1.default.Router();
router.use("/auth/facebook", auth_facebook_1.default);
router.use("/auth", auth_1.default);
router.use("/", oauth_1.default);
exports.default = router;
//# sourceMappingURL=router.js.map