"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContactValidator = exports.updateContactValidator = exports.createContactValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createContactValidator = [
    (0, express_validator_1.body)("fullName")
        .notEmpty()
        .withMessage("Contact full name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Full name must be between 2 and 100 characters"),
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    (0, express_validator_1.body)("phoneNumber")
        .optional()
        .isMobilePhone("any")
        .withMessage("Please provide a valid phone number"),
    (0, express_validator_1.body)("categoryId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Category ID must be a positive integer"),
    (0, express_validator_1.body)("userId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("User ID must be a positive integer"),
];
exports.updateContactValidator = [
    (0, express_validator_1.param)("id")
        .isInt({ min: 1 })
        .withMessage("Contact ID must be a positive integer"),
    (0, express_validator_1.body)("fullName")
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage("Full name must be between 2 and 100 characters"),
    (0, express_validator_1.body)("email")
        .optional()
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    (0, express_validator_1.body)("phoneNumber")
        .optional()
        .isMobilePhone("any")
        .withMessage("Please provide a valid phone number"),
    (0, express_validator_1.body)("categoryId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Category ID must be a positive integer"),
];
exports.deleteContactValidator = [
    (0, express_validator_1.param)("id")
        .isInt({ min: 1 })
        .withMessage("Contact ID must be a positive integer"),
];
