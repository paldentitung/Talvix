import { createApplicationservice } from "./application.service.js";
import { Request, Response } from "express";

export const createApplicationController = async (
  req: Request,
  res: Response,
) => {
  const result = await createApplicationservice(req.user!.id, req.body);

  res.status(200).json({
    success: true,
    message: "Application submitted successfully",
    data: result,
  });
};
