import { ReportStatus } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { CreateReportInput } from "./report.validation.js";

export const getReportsService = async (
  page = 1,
  limit = 10,
  filter?: ReportStatus,
) => {
  const skip = (page - 1) * limit;
  const where = filter ? { status: filter } : {};

  const [reports, totalReports] = await Promise.all([
    prisma.report.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.report.count({ where }),
  ]);

  return {
    reports,
    pagination: {
      page,
      limit,
      totalReports,
      totalPages: Math.ceil(totalReports / limit),
    },
  };
};

export const getReportByIdService = async (id: string) => {
  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      reporter: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      job: {
        select: {
          id: true,
          title: true,
        },
      },
      reportedUser: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  return report;
};

export const createReportService = async (
  reporterId: string,
  data: CreateReportInput,
) => {
  const reporter = await prisma.user.findUnique({
    where: { id: reporterId },
    select: { id: true },
  });

  if (!reporter) {
    throw new AppError("User not found", 404);
  }

  const hasJobId = Boolean(data.jobId);
  const hasReportedUserId = Boolean(data.reportedUserId);

  if (hasJobId === hasReportedUserId) {
    throw new AppError("Provide either a job ID or a reported user ID", 400);
  }

  if (data.jobId) {
    const job = await prisma.job.findUnique({
      where: { id: data.jobId },
      select: { id: true },
    });

    if (!job) {
      throw new AppError("Job not found", 404);
    }
  }

  if (data.reportedUserId) {
    if (data.reportedUserId === reporterId) {
      throw new AppError("You cannot report yourself", 400);
    }

    const reportedUser = await prisma.user.findUnique({
      where: { id: data.reportedUserId },
      select: { id: true },
    });

    if (!reportedUser) {
      throw new AppError("Reported user not found", 404);
    }
  }

  // Prevent duplicate pending reports for the same target
  const existingReport = await prisma.report.findFirst({
    where: {
      reporterId,
      status: ReportStatus.PENDING,
      ...(data.jobId ? { jobId: data.jobId } : {}),
      ...(data.reportedUserId ? { reportedUserId: data.reportedUserId } : {}),
    },
    select: { id: true },
  });

  if (existingReport) {
    throw new AppError(
      "You already have a pending report for this target",
      409,
    );
  }

  const report = await prisma.report.create({
    data: {
      reporterId,
      reason: data.reason,
      description: data.description,
      jobId: data.jobId,
      reportedUserId: data.reportedUserId,
    },
  });

  return report;
};

export const updateReportStatusService = async (
  reportId: string,
  status: ReportStatus,
) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  const updatedReport = await prisma.report.update({
    where: { id: reportId },
    data: {
      status,
      reviewedAt: new Date(),
    },
  });

  return updatedReport;
};

export const getReportStatsService = async () => {
  const [total, pending, resolved, dismissed] = await Promise.all([
    prisma.report.count(),
    prisma.report.count({
      where: { status: ReportStatus.PENDING },
    }),
    prisma.report.count({
      where: { status: ReportStatus.RESOLVED },
    }),
    prisma.report.count({
      where: { status: ReportStatus.DISMISSED },
    }),
  ]);

  return {
    total,
    pending,
    resolved,
    dismissed,
  };
};
