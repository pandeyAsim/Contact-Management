"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const helper_1 = require("../../utils/helper");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const updateProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            throw new utils_1.ApiError({
                status: 401,
                message: "User not authenticated",
            });
        }
        const { fullName, email, currentPassword, newPassword } = req.body;
        const user = await models_1.User.findOne({
            where: { id: req.user.id },
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
        const updateData = {};
        if (fullName !== undefined && fullName.trim() !== user.fullName) {
            if (fullName.trim() === '') {
                throw new utils_1.ApiError({
                    status: 400,
                    message: "Full name cannot be empty",
                });
            }
            updateData.fullName = fullName.trim();
        }
        if (email !== undefined && email.toLowerCase() !== user.email.toLowerCase()) {
            const existingUser = await models_1.User.findOne({
                where: {
                    email: email.toLowerCase(),
                    id: { [Symbol.for('sequelize.op.ne')]: req.user.id }
                },
            });
            if (existingUser) {
                throw new utils_1.ApiError({
                    status: 409,
                    message: "Email address is already taken",
                });
            }
            updateData.email = email.toLowerCase().trim();
            updateData.isEmailVerified = false;
        }
        if (newPassword) {
            if (!currentPassword) {
                throw new utils_1.ApiError({
                    status: 400,
                    message: "Current password is required to change password",
                });
            }
            const isCurrentPasswordValid = await bcrypt_1.default.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                throw new utils_1.ApiError({
                    status: 400,
                    message: "Current password is incorrect",
                });
            }
            const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
            updateData.password = hashedPassword;
        }
        if (Object.keys(updateData).length === 0) {
            throw new utils_1.ApiError({
                status: 400,
                message: "No changes provided",
            });
        }
        await user.update(updateData);
        const updatedUser = await models_1.User.findOne({
            where: { id: req.user.id },
            attributes: ["id", "email", "isEmailVerified", "fullName", "avatar", "createdAt", "updatedAt"],
            include: [
                {
                    model: models_1.Role,
                    attributes: ["id", "title"],
                },
            ],
        });
        const userData = {
            id: updatedUser.id,
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            avatar: (0, helper_1.getQualifiedImageUrl)(updatedUser.avatar),
            isEmailVerified: updatedUser.isEmailVerified,
            role: updatedUser.role,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        };
        new utils_1.ApiResponse({
            status: 200,
            message: "Profile updated successfully",
            data: userData,
        }).send(res);
    }
    catch (error) {
        console.error('Update profile error:', error);
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
            status: 500,
            message: "Internal server error while updating profile",
            errors: [{ server: error instanceof Error ? error.message : 'Unknown error' }]
        });
    }
};
exports.default = updateProfile;
