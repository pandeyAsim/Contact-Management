"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoleValidator = exports.createRoleValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createRoleValidator = [
    (0, express_validator_1.body)("title")
        .notEmpty()
        .withMessage("Role title is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Role title must be between 2 and 50 characters")
        .trim(),
];
exports.deleteRoleValidator = [
    (0, express_validator_1.param)("id")
        .isInt({ min: 1 })
        .withMessage("Role ID must be a positive integer"),
];
