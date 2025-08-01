"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const models_1 = require("../../models");
const invalidateRefreshToken = async (refreshTokenId) => {
    await models_1.RefreshToken.destroy({
        where: { id: refreshTokenId }
    });
};
const createLogoutResponse = () => {
    return {
        status: 200,
        message: "Logged out successfully",
        data: {
            message: "User session has been terminated"
        }
    };
};
const logout = async (req, res) => {
    try {
        if (!req.refreshTokenId) {
            throw new utils_1.ApiError({
                status: 400,
                message: "Invalid session",
            });
        }
        await invalidateRefreshToken(req.refreshTokenId);
        const responseConfig = createLogoutResponse();
        new utils_1.ApiResponse(responseConfig).send(res);
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
            status: 500,
            message: "Failed to logout",
            errors: [
                {
                    message: error instanceof Error ? error.message : "Unknown error"
                }
            ]
        });
    }
};
exports.default = logout;
