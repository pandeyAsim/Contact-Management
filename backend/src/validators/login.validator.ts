import { body, ValidationChain } from "express-validator";

const loginValidator = (): ValidationChain[] => {
  return [
    body("email")
      .exists()
      .withMessage("Email is required")
      .bail()
      .isEmail()
      .withMessage("Email is invalid")
      .bail(),
    body("password")
      .exists()
      .withMessage("Password is required")
      .bail()
      .isString()
      .withMessage("Invalid password")
      .bail()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .bail()
      .isLength({ max: 20 })
      .withMessage("Password must be at most 20 characters long")
      .bail(),
  ];
};

export default loginValidator;
