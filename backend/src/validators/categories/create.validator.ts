import { Category } from "../../models";
import { body, ValidationChain } from "express-validator";
import { Op } from "sequelize";

export const createValidator: ValidationChain[] = [
  body("name")
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
    .custom(async (value) => {
      const category = await Category.findOne({
        where: {
          name: {
            [Op.in]: [value, value.toLowerCase(), value.toUpperCase()],
          },
        },
      });

      if (category) {
        throw new Error("Category with this name already exists");
      }

      return true;
    })
    .bail(),
];
