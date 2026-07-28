import { RequestHandler } from "express";
import { ZodSchema, ZodError } from "zod";
import AppError from "../utils/AppError.js";

export const validate = <T>(schema: ZodSchema<T>): RequestHandler => {
  return (req, _res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new AppError(
            error.issues.map((issue) => issue.message).join(", "),
            400,
          ),
        );
      }

      next(error);
    }
  };
};
