import type { Request, Response } from "express";
import {
  getAdminDashboardService,
  getRecruiterDashboardService,
} from "./dashboard.service.js";

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
export const getRecruiterDashboardController = async (
  req: Request,
  res: Response,
) => {
  const result = await getRecruiterDashboardService(req.user!.id);

  res.status(200).json({
    success: true,
    message: "Recruiter dashboard fetched successfully",
    data: result,
  });
};
