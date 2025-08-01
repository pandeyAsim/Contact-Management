import { body, param, ValidationChain } from "express-validator";

export const updateValidator: ValidationChain[] = [
  param("id")
    .exists()
    .withMessage("Contact ID is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Contact ID must be a positive integer"),

  body("fullName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Full name cannot be empty")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),

  body("phoneNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Phone number cannot be empty")
    .bail()
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone number must be between 10 and 15 characters")
    .bail()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage("Please provide a valid phone number"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .bail()
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage("Email must not exceed 100 characters"),

  body("company")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Company name must not exceed 100 characters"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Address must not exceed 255 characters"),

  body("gender")
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage("Gender must be one of: male, female, other"),

  body("department")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Department must not exceed 100 characters"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Notes must not exceed 1000 characters"),

  body("categoryId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),

  body("isStared")
    .optional()
    .isBoolean()
    .withMessage("isStared must be a boolean value"),
];
