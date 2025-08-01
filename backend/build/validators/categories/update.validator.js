"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateValidator = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../../models");
const express_validator_1 = require("express-validator");
exports.updateValidator = [
    (0, express_validator_1.param)("id")
        .exists()
        .withMessage("ID is required")
        .bail()
        .isNumeric()
        .withMessage("ID must be a number")
        .bail()
        .custom(async (value, { req }) => {
        const category = await models_1.Category.findByPk(value);
        if (!category) {
            return Promise.reject("Category not found");
        }
        req.category = category;
        return true;
    }),
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
        .custom(async (value, { req }) => {
        const category = await models_1.Category.findOne({
            where: {
                id: {
                    [sequelize_1.Op.not]: req.params.id,
                },
                name: {
                    [sequelize_1.Op.in]: [value, value.toLowerCase(), value.toUpperCase()],
                },
            },
        });
        if (category) {
            return Promise.reject("Name already exists");
        }
        return true;
    })
        .bail(),
];
