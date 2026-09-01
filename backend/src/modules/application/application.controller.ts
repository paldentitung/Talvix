import AppError from "../../utils/AppError.js";
import {
  createApplicationService,
  getApplicationByIdService,
  getApplicationsService,
  getMyApplicationsService,
  getRecruiterApplicationsService,
  withdrawApplicationService,
  updateApplicationService,
  getJobApplicationsService,
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

export const getApplicationByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const result = await getApplicationByIdService(id, userId);

  res.status(200).json({
    success: true,
    message: "Application fetched successfully",
    data: result,
  });
};
export const getMyApplicationsController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user!.id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await getMyApplicationsService(userId, page, limit);

  res.status(200).json({
    success: true,
    message: "Applications fetched successfully",
    data: result,
  });
};

export const getJobApplicationsController = async (
  req: Request<{ jobId: string }>,
  res: Response,
) => {
  const { jobId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const applications = await getJobApplicationsService(
    jobId,
    req.user!.id,
    page,
    limit,
  );

  res.status(200).json({
    success: true,
    message: "Job applications are fetched",
    data: applications,
  });
};
export const createApplicationController = async (
  req: Request,
  res: Response,
) => {
  if (!req.file) {
    throw new AppError("Resume is required", 400);
  }
  const result = await createApplicationService(req.user!.id, {
    ...req.body,
    resumeUrl: `/uploads/resumes/${req.file.filename}`,
  });

  res.status(200).json({
    success: true,
    message: "Application submitted successfully",
    data: result,
  });
};

export const withdrawApplicationController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const result = await withdrawApplicationService(id, userId);

  res.status(200).json({
    success: true,
    message: "Application withdrawn successfully",
    data: result,
  });
};
export const updateApplicationController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const recruiterId = req.user!.id;

  const result = await updateApplicationService(id, recruiterId, req.body);

  res.status(200).json({
    success: true,
    message: "Application updated successfully",
    data: result,
  });
};
