"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidator = void 0;
const models_1 = require("../../models");
const express_validator_1 = require("express-validator");
const sequelize_1 = require("sequelize");
exports.createValidator = [
    (0, express_validator_1.body)("name")
        .exists()
        .withMessage("Name is required")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .bail()
        .isLength({ min: 5 })
        .withMessage("Name must be at least 5 characters long")
        .bail()
        .custom(async (value) => {
        const category = await models_1.Category.findOne({
            where: {
                name: {
                    [sequelize_1.Op.in]: [value, value.toLowerCase(), value.toUpperCase()],
                },
            },
        });
        if (category) {
            throw new Error("Category with this name already exists");
        }
        return true;
    })
        .bail(),
];
