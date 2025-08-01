import { EmailVerification } from "../models";
import { param, ValidationChain } from "express-validator";

const verifyValidator = (): ValidationChain[] => {
  return [
    param("token")
      .exists()
      .withMessage("Token is required")
      .bail()
      .isString()
      .withMessage("Token must be a string")
      .bail()
      .isUUID("4")
      .withMessage("Token must be a valid UUID v4")
      .bail()
      .custom(async (value, { req }) => {
        const emailVerification = await EmailVerification.findOne({
          where: {
            token: value,
          },
        });

        if (!emailVerification) {
          throw new Error("Token is invalid");
        }

        if (emailVerification.expiresAt < new Date()) {
          throw new Error("Token has expired");
        }

        req.emailVerification = emailVerification;
        return true;
      }),
  ];
};

export default verifyValidator;
