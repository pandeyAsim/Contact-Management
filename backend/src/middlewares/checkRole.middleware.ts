import { User } from "../models";
import { ApiError } from "../utils";
import { Request, Response, NextFunction } from "express";

const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user: User = req.user;

    if (!roles.includes(user.role.title)) {
      throw new ApiError({
        status: 403,
        message: "Forbidden",
      });
    }

    next();
  };
};

export default checkRole;
