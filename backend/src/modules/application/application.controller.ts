import {
  createApplicationservice,
  getApplicationsService,
  getRecruiterApplicationsService,
} from "./application.service.js";
import { Request, Response } from "express";

export const getApplicationsController = async (
  req: Request,
  res: Response,
) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await getApplicationsService(page, limit);

  res.status(200).json({
    success: true,
    message: "Applications fetched",
    data: result,
  });
};

export const getRecruiterApplicationsController = async (
  req: Request,
  res: Response,
) => {
  const recruiterId = req.user!.id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = getRecruiterApplicationsService(recruiterId, page, limit);
  res.status(200).json({
    success: true,
    message: "Applications fetched successfully",
    data: result,
  });
};

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
