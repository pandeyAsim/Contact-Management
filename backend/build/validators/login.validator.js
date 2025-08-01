"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const loginValidator = () => {
    return [
        (0, express_validator_1.body)("email")
            .exists()
            .withMessage("Email is required")
            .bail()
            .isEmail()
            .withMessage("Email is invalid")
            .bail(),
        (0, express_validator_1.body)("password")
            .exists()
            .withMessage("Password is required")
            .bail()
            .isString()
            .withMessage("Invalid password")
            .bail()
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long")
            .bail()
            .isLength({ max: 20 })
            .withMessage("Password must be at most 20 characters long")
            .bail(),
    ];
};
exports.default = loginValidator;
