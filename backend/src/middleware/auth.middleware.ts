import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import AppError from "../utils/AppError.js";
import prisma from "../lib/prisma.js";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(new AppError("Not authenticated", 401));
  }

  let decoded;

  // 1. Verify the JWT
  try {
    decoded = verifyToken(token);
  } catch {
    return next(new AppError("Invalid or expired session", 401));
  }

  try {
    // 2. Check the user's current status in the database
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!user) {
      res.clearCookie("token");
      return next(new AppError("Invalid or expired session", 401));
    }

    // 3. Block suspended accounts
    if (user.status === "SUSPENDED") {
      res.clearCookie("token");
      return next(
        new AppError(
          "Your account has been suspended. Please contact support.",
          403,
        ),
      );
    }

    // 4. Continue authentication for active users
    (req as any).user = decoded;
    return next();
  } catch (error) {
    return next(error);
  }
};
