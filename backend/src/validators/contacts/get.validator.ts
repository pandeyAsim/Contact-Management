import { Contact, Category } from "../../models";
import { query, ValidationChain } from "express-validator";

export const getValidator: ValidationChain[] = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .bail(),
  query("size")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Size must be a positive integer")
    .bail(),
  query("search")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Search query is required")
    .bail()
    .isString()
    .withMessage("Search query must be a string")
    .bail()
    .isLength({ max: 255 })
    .withMessage("Search query must be less than 255 characters")
    .bail()
    .customSanitizer((value) => value.replace(/[^a-zA-Z0-9\s]/g, ""))
    .bail(),
  query("sort")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Sort is required")
    .isString()
    .withMessage("Sort must be a string")
    .bail()
    .custom((value) => {
      // check whether the sort column exists in the model, replace with id if not
      const sortColumn = Object.keys(Contact.getAttributes()).includes(value);
      if (!sortColumn) {
        throw new Error("Invalid sort column");
      }

      return true;
    })
    .bail(),
  query("order")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Order is required")
    .bail()
    .isString()
    .withMessage("Order must be a string")
    .isIn(["asc", "desc", "ASC", "DESC"])
    .withMessage("Invalid order value")
    .bail()
    .custom((value, { req }) => {
      req.query!.orderBy = value.toLowerCase();
      return true;
    }),
  query("isStared")
    .optional()
    .isBoolean()
    .withMessage("isStared must be a boolean")
    .bail(),
  query("isFrequent")
    .optional()
    .isBoolean()
    .withMessage("isFrequent must be a boolean")
    .bail(),
  query("category")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Category must be a positive integer")
    .bail()
    .custom(async (value, { req }) => {
      const category = await Category.findOne({
        where: { id: value },
      });

      if (!category) {
        throw new Error("Category not found");
      }

      req.category = category;
      return true;
    }),
];
