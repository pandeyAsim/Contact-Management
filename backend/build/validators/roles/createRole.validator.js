"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoleValidator = void 0;
const express_validator_1 = require("express-validator");
const models_1 = require("../../models");
exports.createRoleValidator = [
    (0, express_validator_1.body)("title")
        .exists()
        .withMessage("Title is required")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty")
        .bail()
        .isLength({ min: 2 })
        .withMessage("Title must be at least 2 characters long")
        .bail()
        .isLength({ max: 50 })
        .withMessage("Title must be at most 50 characters long")
        .bail()
        .custom(async (value) => {
        const existingRole = await models_1.Role.findOne({
            where: {
                title: value.toLowerCase(),
            },
        });
        if (existingRole) {
            throw new Error("Role with this title already exists");
        }
        return true;
    }),
];
