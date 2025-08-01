import { param, ValidationChain } from "express-validator";

export const getSingleValidator: ValidationChain[] = [
  param("id")
    .exists()
    .withMessage("Contact ID is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Contact ID must be a positive integer"),
];
