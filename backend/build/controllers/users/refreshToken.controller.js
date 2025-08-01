"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const jwtUtils_1 = require("../../utils/jwtUtils");
const refreshToken = async (req, res) => {
    const token = (0, jwtUtils_1.getAuthToken)({ req });
    if (!token) {
        throw new utils_1.ApiError({
            status: 401,
            message: "Unauthorized",
            errors: [
                {
                    token: "Token not found",
                },
            ],
            stack: "Token not found",
        });
    }
    try {
        const decodedToken = await (0, jwtUtils_1.verifyToken)({ token });
        if (!decodedToken) {
            throw new utils_1.ApiError({
                status: 401,
                message: "Unauthorized",
                errors: [
                    {
                        token: "Token not valid",
                    },
                ],
                stack: "Token not valid",
            });
        }
        const refreshToken = await models_1.RefreshToken.findOne({
            where: {
                token: token,
            },
        });
        if (!refreshToken) {
            throw new utils_1.ApiError({
                message: "Invalid token",
                status: 401,
                errors: [
                    {
                        token: "Invalid token",
                    },
                ],
            });
        }
        if (refreshToken.isExpired) {
            throw new utils_1.ApiError({
                status: 401,
                message: "Unauthorized",
                errors: [
                    {
                        token: "Refresh token expired",
                    },
                ],
                stack: "Refresh token expired",
            });
        }
        if (refreshToken.expiresAt < new Date()) {
            throw new utils_1.ApiError({
                message: "Invalid token",
                status: 401,
                errors: [
                    {
                        token: "Token expired",
                    },
                ],
            });
        }
        const user = await models_1.User.findByPk(decodedToken.userId, {
            attributes: ["id", "email"],
            include: [
                {
                    model: models_1.Role,
                    attributes: ["id", "title"],
                },
            ],
        });
        if (!user) {
            throw new utils_1.ApiError({
                status: 401,
                message: "Unauthorized",
                errors: [
                    {
                        token: "User not found",
                    },
                ],
                stack: "User not found",
            });
        }
        const accessToken = await (0, jwtUtils_1.generateAccessToken)({
            payload: {
                userId: user.id,
                refreshTokenId: refreshToken.id,
            },
        });
        new utils_1.ApiResponse({
            status: 200,
            message: "Refresh token",
            data: {
                accessToken,
                user,
            },
        }).send(res);
    }
    catch (error) {
        console.error("Error in refreshToken controller:", error);
        throw new utils_1.ApiError({
            status: 401,
            message: "Unauthorized",
            stack: error.stack,
        });
    }
};
exports.default = refreshToken;
