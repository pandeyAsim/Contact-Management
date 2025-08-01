import { ValidationChain, body } from "express-validator";

export const updateProfileValidator = (): ValidationChain[] => [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Full name must be between 2 and 50 characters")
    .trim(),
  
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
];

export const updateProfileImageValidator = (): ValidationChain[] => [
  // Image validation will be handled by multer middleware
  // This validator can be used for additional checks if needed
];

export default updateProfileValidator;
