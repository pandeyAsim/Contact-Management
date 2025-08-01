"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const express_validator_1 = require("express-validator");
const verifyValidator = () => {
    return [
        (0, express_validator_1.param)("token")
            .exists()
            .withMessage("Token is required")
            .bail()
            .isString()
            .withMessage("Token must be a string")
            .bail()
            .isUUID("4")
            .withMessage("Token must be a valid UUID v4")
            .bail()
            .custom(async (value, { req }) => {
            const emailVerification = await models_1.EmailVerification.findOne({
                where: {
                    token: value,
                },
            });
            if (!emailVerification) {
                throw new Error("Token is invalid");
            }
            if (emailVerification.expiresAt < new Date()) {
                throw new Error("Token has expired");
            }
            req.emailVerification = emailVerification;
            return true;
        }),
    ];
};
exports.default = verifyValidator;
