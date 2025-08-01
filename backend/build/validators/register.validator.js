"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const express_validator_1 = require("express-validator");
const registerValidator = () => {
    return [
        (0, express_validator_1.body)("email")
            .exists()
            .withMessage("Email is required")
            .bail()
            .isEmail()
            .withMessage("Email is invalid")
            .bail()
            .custom(async (value) => {
            const user = await models_1.User.findOne({
                where: {
                    email: value,
                },
            });
            if (user) {
                throw new Error("Email already exists");
            }
            return true;
        }),
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
exports.default = registerValidator;
