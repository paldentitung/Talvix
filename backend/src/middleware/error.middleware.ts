import { NextFunction, Request, Response } from "express";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(err);

  res
    .status(err.statusCode || 500)
    .json({ success: false, message: err.message || "server error" });
};
export default errorMiddleware;
