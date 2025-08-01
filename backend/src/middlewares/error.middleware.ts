import { ApiError } from "../utils";
import { NextFunction, Request, Response } from "express";
import { UniqueConstraintError, ValidationError } from "sequelize";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error: ApiError;

  if (!(err instanceof ApiError)) {
    error = new ApiError({
      status: 500,
      message: "Something went wrong",
      errors: [
        {
          message: err.message,
        },
      ],
      stack: err.stack,
    });
  } else {
    error = err;
  }

  const response = {
    ...error,
    message: error.message,
    errors: error.errors,
  };

  res.status(error.status).json(response);
  next();
  return;
};

export default errorHandler;
