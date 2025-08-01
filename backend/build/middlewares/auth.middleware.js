"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwtUtils_1 = require("../utils/jwtUtils");
const utils_1 = require("../utils");
const models_1 = require("../models");
const helper_1 = require("../utils/helper");
const authMiddleware = async (req, res, next) => {
    try {
        console.log('=== AUTH MIDDLEWARE DEBUG ===');
        console.log('Request URL:', req.url);
        console.log('Authorization header:', req.headers.authorization);
        const token = (0, jwtUtils_1.getAuthToken)({ req });
        console.log('Extracted token:', token ? 'Present' : 'Missing');
        if (!token) {
            console.log('❌ Token not provided');
            throw new utils_1.ApiError({
                status: 401,
                message: "Token not provided",
            });
        }
        console.log('Verifying token...');
        const payload = (0, jwtUtils_1.verifyToken)({ token });
        console.log('Token payload:', payload ? 'Valid' : 'Invalid');
        if (!payload) {
            console.log('❌ Invalid token payload');
            throw new utils_1.ApiError({
                status: 401,
                message: "Invalid token",
            });
        }
        const refreshTokenId = payload.refreshTokenId;
        console.log('Refresh token ID from payload:', refreshTokenId);
        const refreshToken = await models_1.RefreshToken.findOne({
            where: { id: refreshTokenId },
        });
        console.log('Refresh token found in DB:', refreshToken ? 'Yes' : 'No');
        if (!refreshToken) {
            console.log('❌ Refresh token not found in DB');
            throw new utils_1.ApiError({
                status: 401,
                message: "Refresh token not found",
            });
        }
        const now = new Date();
        console.log('Current time:', now);
        console.log('Refresh token expires at:', refreshToken.expiresAt);
        console.log('Is refresh token expired?', refreshToken.expiresAt < now);
        if (refreshToken.expiresAt < new Date()) {
            console.log('❌ Refresh token expired');
            throw new utils_1.ApiError({
                status: 401,
                message: "Refresh token expired",
            });
        }
        if (refreshToken.isExpired) {
            console.log('❌ Refresh token marked as expired');
            throw new utils_1.ApiError({
                status: 401,
                message: "Refresh token is expired",
            });
        }
        console.log('Verifying refresh token...');
        await (0, jwtUtils_1.verifyToken)({
            token: refreshToken.token,
        });
        console.log('Looking up user with ID:', payload.userId);
        const user = await models_1.User.findOne({
            where: { id: payload.userId },
            attributes: ["id", "email", "isEmailVerified", "fullName", "avatar"],
            include: [
                {
                    model: models_1.Role,
                    attributes: ["id", "title"],
                },
            ],
        });
        console.log('User found:', user ? `${user.fullName} (${user.email})` : 'Not found');
        if (!user) {
            console.log('❌ User not found');
            throw new utils_1.ApiError({
                status: 401,
                message: "User not found",
            });
        }
        console.log('User email verified:', user.isEmailVerified);
        if (!user.isEmailVerified) {
            console.log('❌ Email not verified');
            throw new utils_1.ApiError({
                status: 403,
                message: "Email not verified",
            });
        }
        user.dataValues.avatar = (0, helper_1.getQualifiedImageUrl)(user?.avatar);
        req.user = user;
        req.refreshTokenId = refreshTokenId;
        console.log('✅ Authentication successful for user:', user.fullName);
        console.log('User role:', user.role?.title);
        next();
    }
    catch (error) {
        console.log('❌ Auth middleware error:', error);
        if (error instanceof utils_1.ApiError) {
            return next(error);
        }
        throw new utils_1.ApiError({
            status: 401,
            message: "Unauthorized access",
        });
    }
};
exports.default = authMiddleware;
