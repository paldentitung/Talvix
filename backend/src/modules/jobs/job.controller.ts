import { Request, Response } from "express";
import {
  getJobsService,
  getJobService,
  createJobService,
  deleteJobService,
  updateJobService,
} from "./job.service.js";
import { CreateJobInput } from "./job.types.js";
export const getJobsController = async (req: Request, res: Response) => {
  const result = await getJobsService();

  res.status(200).json({
    success: true,
    message: "Jobs fetch sucessfully",
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
