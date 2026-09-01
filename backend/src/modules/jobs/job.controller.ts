import { Request, Response } from "express";
import {
  getJobsService,
  getJobService,
  createJobService,
  deleteJobService,
  updateJobService,
  getRecruiterJobsService,
  updateJobStatusService,
  saveJobService,
  getSavedJobsService,
} from "./job.service.js";
import { jobFiltersSchema } from "./job.types.js";
export const getJobsController = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const search = req.query.search as string | undefined;

  const parsed = jobFiltersSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid filter parameters",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const result = await getJobsService(page, pageSize, search, parsed.data);

  res.status(200).json({
    success: true,
    message: "Jobs fetched successfully",
    data: result,
  });
};
export const updateJobStatusController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const result = await updateJobStatusService(
    req.params.id,
    req.body.status,
    req.user!.id,
    req.user!.role,
  );

  res.status(200).json({
    success: true,
    message: "Job status updated successfully",
    data: result,
  });
};
export const getRecruiterJobsController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await getRecruiterJobsService(userId, userRole, page, limit);

  res.status(200).json({
    success: true,
    message: "Recruiter Jobs fetch sucessfully",
    data: result,
  });
};

export const getJobController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const result = await getJobService(req.params.id);

  res.status(200).json({
    success: true,
    message: "Job fetch successfully",
    data: result,
  });
};

export const createJobController = async (req: Request, res: Response) => {
  const job = await createJobService(req.body, req.user!.id);

  res.status(201).json({
    success: true,
    message: "Job create successfully",
    data: job,
  });
};

export const deleteJobController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const job = await deleteJobService(
    req.params.id,
    req.user!.id,
    req.user!.role,
  );

  res.status(201).json({
    success: true,
    message: "Job deleted successfully",
    data: job,
  });
};

export const updateJobController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const result = await updateJobService(
    req.params.id,
    req.body,
    req.user!.id,
    req.user!.role,
  );

  res.status(200).json({
    success: true,
    message: "Job updated successfully",
    data: result,
  });
};

export const saveJobController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const result = await saveJobService(req.user!.id, req.params.id);

  res.status(200).json({
    success: true,
    message: result.saved
      ? "Job saved successfully"
      : "Job removed from saved jobs",
    data: result,
  });
};
export const getSavedJobsController = async (req: Request, res: Response) => {
  const savedJobs = await getSavedJobsService(req.user!.id);
  res.status(200).json({
    success: true,
    data: savedJobs,
  });
};
