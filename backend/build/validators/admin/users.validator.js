"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserValidator = exports.updateUserRoleValidator = exports.updateUserValidator = exports.createUserValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createUserValidator = [
    (0, express_validator_1.body)("fullName")
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Full name must be between 2 and 100 characters"),
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("roleId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Role ID must be a positive integer"),
];
exports.updateUserValidator = [
    (0, express_validator_1.param)("id")
        .isInt({ min: 1 })
        .withMessage("User ID must be a positive integer"),
    (0, express_validator_1.body)("fullName")
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage("Full name must be between 2 and 100 characters"),
    (0, express_validator_1.body)("email")
        .optional()
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    (0, express_validator_1.body)("role")
        .optional()
        .isString()
        .withMessage("Role must be a string"),
];
exports.updateUserRoleValidator = [
    (0, express_validator_1.param)("id")
        .isInt({ min: 1 })
        .withMessage("User ID must be a positive integer"),
    (0, express_validator_1.body)("role")
        .notEmpty()
        .withMessage("Role is required")
        .isString()
        .withMessage("Role must be a string"),
];
exports.deleteUserValidator = [
    (0, express_validator_1.param)("id")
        .isInt({ min: 1 })
        .withMessage("User ID must be a positive integer"),
];
