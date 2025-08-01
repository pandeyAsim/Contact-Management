"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const helper_1 = require("../../utils/helper");
const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            throw new utils_1.ApiError({
                status: 401,
                message: "User not authenticated",
            });
        }
        const user = await models_1.User.findOne({
            where: { id: req.user.id },
            attributes: ["id", "email", "isEmailVerified", "fullName", "avatar", "createdAt", "updatedAt"],
            include: [
                {
                    model: models_1.Role,
                    attributes: ["id", "title"],
                },
            ],
        });
        if (!user) {
            throw new utils_1.ApiError({
                status: 404,
                message: "User not found",
            });
        }
        if (!user.isEmailVerified) {
            throw new utils_1.ApiError({
                status: 403,
                message: "Email not verified. Please verify your email before accessing your profile.",
            });
        }
        const userData = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            avatar: (0, helper_1.getQualifiedImageUrl)(user.avatar),
            isEmailVerified: user.isEmailVerified,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        new utils_1.ApiResponse({
            status: 200,
            message: "Profile retrieved successfully",
            data: userData,
        }).send(res);
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
            status: 500,
            message: "Failed to retrieve profile",
            errors: [
                {
                    message: error instanceof Error ? error.message : "Unknown error"
                }
            ]
        });
    }
};
exports.default = getProfile;
