import { body } from "express-validator";

export const forgotPasswordValidator = () => [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
];

export const resetPasswordValidator = () => [
  body("token")
    .notEmpty()
    .withMessage("Reset token is required")
    .isLength({ min: 32, max: 32 })
    .withMessage("Invalid reset token format"),
  
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
];
