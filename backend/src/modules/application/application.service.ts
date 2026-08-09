import prisma from "../../lib/prisma.js";
import AppError from ".././../utils/AppError.js";
import {
  ApplicationResponse,
  CreateApplicationInput,
} from "./application.types.js";

export const getApplicationsService = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      skip,
      take: limit,
      orderBy: {
        appliedAt: "desc",
      },
    }),

    prisma.application.count(),
  ]);

  return {
    applications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getRecruiterApplicationsService = async (
  recruiterId: string,
  page = 1,
  limit = 10,
) => {
  const skip = (page - 1) * limit;

  const where = {
    job: {
      recruiterId,
    },
  };

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        appliedAt: "desc",
      },
    }),

    prisma.application.count({
      where,
    }),
  ]);

  return {
    applications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getApplicationByIdService = async (
  applicationId: string,
  userId: string,
) => {
  return prisma.application.findFirst({
    where: {
      id: applicationId,
      OR: [
        {
          userId,
        },
        {
          job: {
            recruiterId: userId,
          },
        },
      ],
    },
    include: {
      user: true,
      job: true,
    },
  });
};
export const createApplicationservice = async (
  userId: string,
  data: CreateApplicationInput,
) => {
  const { jobId, coverLetter, resumeUrl } = data;

  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  if (job.status !== "OPEN") {
    throw new AppError("This job is no longer accepting applications", 400);
  }

  if (job.deadline && job.deadline < new Date()) {
    throw new AppError("The application deadline has passed", 400);
  }

  const existingApplication = await prisma.application.findUnique({
    where: {
      userId_jobId: {
        userId,
        jobId,
      },
    },
  });

  if (existingApplication) {
    throw new AppError("You have already applied for this job", 409);
  }

  const application = await prisma.application.create({
    data: {
      userId,
      jobId,
      coverLetter,
      resumeUrl,
    },
  });

  return application;
};

export const withdrawApplicationService = async (
  applicationId: string,
  userId: string,
) => {
  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      userId,
    },
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  return prisma.application.delete({
    where: {
      id: applicationId,
    },
  });
};
