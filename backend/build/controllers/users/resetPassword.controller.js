"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("../../utils");
const models_1 = require("../../models");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const validateResetToken = async (token) => {
    const user = await models_1.User.findOne({
        where: {
            resetPasswordToken: token,
        }
    });
    if (!user || !user.resetPasswordExpires) {
        return null;
    }
    if (user.resetPasswordExpires < new Date()) {
        return null;
    }
    return user;
};
const hashNewPassword = async (password) => {
    return await bcrypt_1.default.hash(password, 10);
};
const clearResetTokenFields = async (user) => {
    await user.update({
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined
    });
};
const createResetPasswordResponse = () => {
    return {
        status: 200,
        message: "Password reset successfully",
        data: {
            message: "Your password has been updated. You can now login with your new password."
        }
    };
};
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const user = await validateResetToken(token);
        if (!user) {
            throw new utils_1.ApiError({
                status: 400,
                message: "Invalid or expired reset token",
            });
        }
        const hashedPassword = await hashNewPassword(password);
        await user.update({
            password: hashedPassword
        });
        await clearResetTokenFields(user);
        const responseConfig = createResetPasswordResponse();
        new utils_1.ApiResponse(responseConfig).send(res);
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
            status: 500,
            message: "Failed to reset password",
            errors: [
                {
                    message: error instanceof Error ? error.message : "Unknown error"
                }
            ]
        });
    }
};
exports.resetPassword = resetPassword;
exports.default = exports.resetPassword;
