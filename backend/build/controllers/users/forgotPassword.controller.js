"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = void 0;
const utils_1 = require("../../utils");
const models_1 = require("../../models");
const mailHelper_1 = require("../../utils/mailHelper");
const nanoid_1 = require("nanoid");
const generateResetToken = () => {
    return (0, nanoid_1.nanoid)(32);
};
const createForgotPasswordResponse = () => {
    return {
        status: 200,
        message: "Password reset email sent successfully",
        data: {
            message: "If the email exists, you will receive a password reset link"
        }
    };
};
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await models_1.User.findOne({
            where: { email: email.toLowerCase() }
        });
        if (!user) {
            const responseConfig = createForgotPasswordResponse();
            return new utils_1.ApiResponse(responseConfig).send(res);
        }
        const resetToken = generateResetToken();
        const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
        await user.update({
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetTokenExpiry
        });
        await (0, mailHelper_1.sendPasswordResetEmail)({
            email: user.email,
            resetToken,
            fullName: user.fullName || 'User'
        });
        const responseConfig = createForgotPasswordResponse();
        new utils_1.ApiResponse(responseConfig).send(res);
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
            status: 500,
            message: "Failed to process password reset request",
            errors: [
                {
                    message: error instanceof Error ? error.message : "Unknown error"
                }
            ]
        });
    }
};
exports.forgotPassword = forgotPassword;
exports.default = exports.forgotPassword;
