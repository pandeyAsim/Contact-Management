import { sign, verify } from "jsonwebtoken";
import { Request } from "express";
import env from "../config/env.config";

export const JWT_REFRESH_EXPIRES_IN = 120 * 24 * 60; // 120 days in minutes
export const JWT_ACCESS_EXPIRES_IN = 15; // 15 minutes in minutes

export const generateAccessToken = ({
  payload,
}: {
  payload: Record<string, unknown>;
}) => {
  return sign(payload, env.JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN * 60,
  });
};

export const generateRefreshToken = ({
  payload,
}: {
  payload: Record<string, unknown>;
}) => {
  return sign(payload, env.JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN * 60,
  });
};

export const verifyToken = ({ token }: { token: string }): any => {
  try {
    const decoded = verify(token, env.JWT_SECRET);
    return decoded;
  } catch {
    return null;
  }
};

export const removeBearer = ({ token }: { token: string }): string => {
  if (token.startsWith("Bearer ")) {
    return token.slice(7, token.length);
  }

  return token;
};

export const getAuthToken = ({ req }: { req: Request }): string | null => {
  const authorization = req.headers.authorization;

  if (
    authorization &&
    typeof authorization === "string" &&
    authorization.split(" ")[0] === "Bearer"
  ) {
    return removeBearer({ token: authorization });
  }

  return null;
};
