import type { Request, Response } from "express";
import { getAdminDashboardService } from "./dashboard.service.js";

export const getAdminDashboardController = async (
  req: Request,
  res: Response,
) => {
  const result = await getAdminDashboardService();

  res.status(200).json({
    success: true,
    message: "Admin dashboard fetched successfully",
    data: result,
  });
};
