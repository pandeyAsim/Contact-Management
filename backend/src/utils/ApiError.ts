/**
 * @description API error class
 * @class ApiError
 * @extends {Error}
 * The {@link errorHandlerMiddleware } will catch this error and return a response to the client
 * @param {ApiErrorOptions} options - The error options
 * @returns {ApiError} - An instance of ApiError
 */

interface ApiErrorOptions {
  status?: number;
  message?: string;
  data?: any;
  errors?: any;
  stack?: string;
}

class ApiError extends Error {
  public status: number;
  public message: string;
  public data?: any;
  public errors?: any;

  constructor(options: ApiErrorOptions) {
    super(options.message);
    this.status = options.status || 500;
    this.message = options.message || "Something went wrong";
    this.data = options.data;
    this.errors = options.errors;

    Error.captureStackTrace(this, this.constructor);

    if (options.stack) {
      this.stack = options.stack;
    }
  }
}

export default ApiError;
