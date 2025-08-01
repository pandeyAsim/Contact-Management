import { body, param } from "express-validator";

// Create Contact Validation
export const createContactValidator = [
  body("fullName")
    .notEmpty()
    .withMessage("Contact full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("phoneNumber")
    .optional()
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),
  body("categoryId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),
  body("userId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer"),
];

// Update Contact Validation
export const updateContactValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Contact ID must be a positive integer"),
  body("fullName")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("phoneNumber")
    .optional()
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),
  body("categoryId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),
];

// Delete Contact Validation
export const deleteContactValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Contact ID must be a positive integer"),
];
