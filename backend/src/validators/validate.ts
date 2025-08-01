import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils";

// Helper function to extract validation errors
const extractValidationErrors = (errors: any[]) => {
  const extractedErrors: { [x: string]: any }[] = [];

  errors.forEach((err) => {
    switch (err.type) {
      case "field":
        extractedErrors.push({ [err.path]: err.msg });
        break;
      default:
        extractedErrors.push({
          [err.type]: err.msg,
        });
    }
  });

  return extractedErrors;
};

// Helper function to create validation error response
const createValidationError = (errors: any[], extractedErrors: { [x: string]: any }[]) => {
  return new ApiError({
    message: errors[0].msg,
    errors: extractedErrors,
    status: 400,
  });
};

const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorArray = errors.array();
    const extractedErrors = extractValidationErrors(errorArray);
    const validationError = createValidationError(errorArray, extractedErrors);
    
    throw validationError;
  }

  next();
};

export default validate;
