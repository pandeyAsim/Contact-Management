"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthToken = exports.removeBearer = exports.verifyToken = exports.generateRefreshToken = exports.generateAccessToken = exports.JWT_ACCESS_EXPIRES_IN = exports.JWT_REFRESH_EXPIRES_IN = void 0;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = require("jsonwebtoken");
const env_config_1 = tslib_1.__importDefault(require("../config/env.config"));
exports.JWT_REFRESH_EXPIRES_IN = 120 * 24 * 60;
exports.JWT_ACCESS_EXPIRES_IN = 15;
const generateAccessToken = ({ payload, }) => {
    return (0, jsonwebtoken_1.sign)(payload, env_config_1.default.JWT_SECRET, {
        expiresIn: exports.JWT_ACCESS_EXPIRES_IN * 60,
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = ({ payload, }) => {
    return (0, jsonwebtoken_1.sign)(payload, env_config_1.default.JWT_SECRET, {
        expiresIn: exports.JWT_REFRESH_EXPIRES_IN * 60,
    });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyToken = ({ token }) => {
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, env_config_1.default.JWT_SECRET);
        return decoded;
    }
    catch {
        return null;
    }
};
exports.verifyToken = verifyToken;
const removeBearer = ({ token }) => {
    if (token.startsWith("Bearer ")) {
        return token.slice(7, token.length);
    }
    return token;
};
exports.removeBearer = removeBearer;
const getAuthToken = ({ req }) => {
    const authorization = req.headers.authorization;
    if (authorization &&
        typeof authorization === "string" &&
        authorization.split(" ")[0] === "Bearer") {
        return (0, exports.removeBearer)({ token: authorization });
    }
    return null;
};
exports.getAuthToken = getAuthToken;
