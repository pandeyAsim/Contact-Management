"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileImageValidator = exports.updateProfileValidator = void 0;
const express_validator_1 = require("express-validator");
const updateProfileValidator = () => [
    (0, express_validator_1.body)("fullName")
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Full name must be between 2 and 50 characters")
        .trim(),
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),
];
exports.updateProfileValidator = updateProfileValidator;
const updateProfileImageValidator = () => [];
exports.updateProfileImageValidator = updateProfileImageValidator;
exports.default = exports.updateProfileValidator;
