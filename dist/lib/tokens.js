"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
const crypto_1 = require("crypto");
function generateToken(length = 16) {
    return (0, crypto_1.randomBytes)(length).toString("hex");
}
