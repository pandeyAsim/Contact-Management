"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const models_1 = require("../../models");
const env_config_1 = tslib_1.__importDefault(require("../../config/env.config"));
const verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const emailVerification = await models_1.EmailVerification.findOne({
            where: {
                token,
            },
        });
        if (!emailVerification) {
            return res.redirect(`${env_config_1.default.FRONTEND_URL}/login?error=invalid-verification-token`);
        }
        if (emailVerification.expiresAt < new Date()) {
            return res.redirect(`${env_config_1.default.FRONTEND_URL}/login?error=verification-token-expired`);
        }
        await models_1.User.update({ isEmailVerified: true }, {
            where: {
                id: emailVerification.userId,
            },
        });
        await emailVerification.destroy();
        res.redirect(`${env_config_1.default.FRONTEND_URL}/login?verified=true`);
    }
    catch (error) {
        console.error('Email verification error:', error);
        res.redirect(`${env_config_1.default.FRONTEND_URL}/login?error=verification-failed`);
    }
};
exports.default = verifyEmail;
