import { body, param } from "express-validator";

// Create Category Validation
export const createCategoryValidator = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters"),
];

// Update Category Validation
export const updateCategoryValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters"),
];

// Delete Category Validation
export const deleteCategoryValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),
];
