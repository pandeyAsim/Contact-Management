"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidator = exports.forgotPasswordValidator = void 0;
const express_validator_1 = require("express-validator");
const forgotPasswordValidator = () => [
    (0, express_validator_1.body)("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please provide a valid email address"),
];
exports.forgotPasswordValidator = forgotPasswordValidator;
const resetPasswordValidator = () => [
    (0, express_validator_1.body)("token")
        .notEmpty()
        .withMessage("Reset token is required")
        .isLength({ min: 32, max: 32 })
        .withMessage("Invalid reset token format"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
];
exports.resetPasswordValidator = resetPasswordValidator;
