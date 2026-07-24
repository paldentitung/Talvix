import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import AppError from "../utils/AppError.js";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new AppError("Not authenticated", 401);
  }

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch {
    throw new AppError("Invalid or expired session", 401);
  }
};
