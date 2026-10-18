import type { Request, Response, NextFunction } from "express";
import {
  getReportsService,
  createReportService,
  getReportByIdService,
  getReportStatsService,
  updateReportStatusService,
} from "./report.service.js";
import { ReportStatus } from "@prisma/client";

export const getReportsController = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const filter = req.query.status as ReportStatus;
  const reports = await getReportsService(page, limit, filter);

  res.status(200).json({
    success: true,
    message: "Reports fetched successfully",
    data: reports,
  });
};
export const getReportByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;

  const report = await getReportByIdService(id);

  res.status(200).json({
    success: true,
    message: "Report fetched successfully",
    data: report,
  });
};
export const createReportController = async (req: Request, res: Response) => {
  const reporterId = req.user!.id;
  const report = await createReportService(reporterId, req.body);

  res.status(201).json({
    success: true,
    message: "Report submitted successfully",
    data: report,
  });
};

export const updateReportStatusController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const { status } = req.body;

  const report = await updateReportStatusService(id, status);

  res.status(200).json({
    success: true,
    message: "Report status updated successfully",
    data: report,
  });
};
export const getReportStatsController = async (req: Request, res: Response) => {
  const stats = await getReportStatsService();

  res.status(200).json({
    success: true,
    message: "Report statistics fetched successfully",
    data: stats,
  });
};
