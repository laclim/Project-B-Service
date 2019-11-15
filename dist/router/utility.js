"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sendResponse(res, message, error) {
    res
        .status(error !== null ? (error !== null ? 400 : 200) : 400)
        .json({
        message: message,
        error: error
    })
        .end();
}
exports.sendResponse = sendResponse;
//# sourceMappingURL=utility.js.map