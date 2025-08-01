import { getQualifiedImageUrl } from "../../utils/helper";
import { Category } from "../../models";
import { param, ValidationChain } from "express-validator";

export const getSingleValidator: ValidationChain[] = [
  param("id")
    .exists()
    .withMessage("ID is required")
    .bail()
    .isNumeric()
    .withMessage("ID must be a number")
    .custom(async (value, { req }) => {
      const category = await Category.findOne({
        where: { id: value },
        attributes: ["id", "name", "slug", "image"],
      });

      if (!category) {
        throw new Error("category not found");
      }

      category.dataValues.image = getQualifiedImageUrl(category.image);

      req.category = category;

      return true;
    })
    .bail(),
];
