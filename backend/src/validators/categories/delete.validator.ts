import { Category } from "../../models";
import { param, ValidationChain } from "express-validator";

export const deleteValidator: ValidationChain[] = [
  param("id")
    .exists()
    .withMessage("ID is required")
    .bail()
    .isNumeric()
    .withMessage("ID must be a number")
    .bail()
    .custom(async (value, { req }) => {
      const category = await Category.findByPk(value);

      if (!category) {
        return Promise.reject("Category not found");
      }

      req.category = category;

      return true;
    }),
];
