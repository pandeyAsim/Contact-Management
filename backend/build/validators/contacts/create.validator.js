"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createValidator = [
    (0, express_validator_1.body)("fullName")
        .exists()
        .withMessage("Full name is required")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Full name cannot be empty")
        .bail()
        .isLength({ min: 2, max: 100 })
        .withMessage("Full name must be between 2 and 100 characters"),
    (0, express_validator_1.body)("phoneNumber")
        .exists()
        .withMessage("Phone number is required")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Phone number cannot be empty")
        .bail()
        .isLength({ min: 10, max: 15 })
        .withMessage("Phone number must be between 10 and 15 characters")
        .bail()
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage("Please provide a valid phone number"),
    (0, express_validator_1.body)("email")
        .exists()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .bail()
        .normalizeEmail()
        .isLength({ max: 100 })
        .withMessage("Email must not exceed 100 characters"),
    (0, express_validator_1.body)("company")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Company name must not exceed 100 characters"),
    (0, express_validator_1.body)("address")
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage("Address must not exceed 255 characters"),
    (0, express_validator_1.body)("gender")
        .optional()
        .isIn(['male', 'female', 'other'])
        .withMessage("Gender must be one of: male, female, other"),
    (0, express_validator_1.body)("department")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Department must not exceed 100 characters"),
    (0, express_validator_1.body)("notes")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Notes must not exceed 1000 characters"),
    (0, express_validator_1.body)("categoryId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Category ID must be a positive integer"),
];
