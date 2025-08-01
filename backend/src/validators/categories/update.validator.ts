import { Op } from "sequelize";
import { Category } from "../../models";
import { body, param, ValidationChain } from "express-validator";

export const updateValidator: ValidationChain[] = [
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
    .custom(async (value, { req }) => {
      const category = await Category.findOne({
        where: {
          id: {
            [Op.not]: req.params!.id,
          },
          name: {
            [Op.in]: [value, value.toLowerCase(), value.toUpperCase()],
          },
        },
      });

      if (category) {
        return Promise.reject("Name already exists");
      }

      return true;
    })
    .bail(),
];
