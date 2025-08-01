import { body, param } from "express-validator";

// Create User Validation
export const createUserValidator = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("roleId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Role ID must be a positive integer"),
];

// Update User Validation
export const updateUserValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer"),
  body("fullName")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("role")
    .optional()
    .isString()
    .withMessage("Role must be a string"),
];

// Update User Role Validation
export const updateUserRoleValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isString()
    .withMessage("Role must be a string"),
];

// Delete User Validation
export const deleteUserValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer"),
];
