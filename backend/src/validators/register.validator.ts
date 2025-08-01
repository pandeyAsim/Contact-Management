import { User } from "../models";
import { body, ValidationChain } from "express-validator";

const registerValidator = (): ValidationChain[] => {
  return [
    body("email")
      .exists()
      .withMessage("Email is required")
      .bail()
      .isEmail()
      .withMessage("Email is invalid")
      .bail()
      .custom(async (value) => {
        const user = await User.findOne({
          where: {
            email: value,
          },
        });

        if (user) {
          throw new Error("Email already exists");
        }

        return true;
      }),
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

export default registerValidator;
