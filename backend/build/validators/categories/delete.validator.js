"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteValidator = void 0;
const models_1 = require("../../models");
const express_validator_1 = require("express-validator");
exports.deleteValidator = [
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
];
