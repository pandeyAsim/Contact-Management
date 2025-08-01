import { body, param } from "express-validator";

// Create Role Validation
export const createRoleValidator = [
  body("title")
    .notEmpty()
    .withMessage("Role title is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Role title must be between 2 and 50 characters")
    .trim(),
];

// Delete Role Validation
export const deleteRoleValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Role ID must be a positive integer"),
];
