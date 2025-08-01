import { param, ValidationChain } from "express-validator";

export const deleteValidator: ValidationChain[] = [
  param("id")
    .exists()
    .withMessage("Contact ID is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Contact ID must be a positive integer"),
];
