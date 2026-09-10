import prisma from "../../lib/prisma.js";
import AppError from ".././../utils/AppError.js";
import {
  CreateApplicationInput,
  UpdateApplicationInput,
} from "./application.types.js";
import { ApplicationStatus } from "@prisma/client";
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
export const getMyApplicationsService = async (
  userId: string,
  page = 1,
  limit = 10,
) => {
  const skip = (page - 1) * limit;

  const where = {
    userId,
  };

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        appliedAt: "desc",
      },
      include: {
        job: {
          include: {
            recruiter: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                recruiterProfile: {
                  select: {
                    companyName: true,
                    companyLogo: true,
                    companyWebsite: true,
                  },
                },
              },
            },
          },
        },
        statusHistory: {
          orderBy: {
            createdAt: "asc",
          },
        },
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
export const getJobApplicationsService = async (
  jobId: string,
  recruiterId: string,
  page = 1,
  limit = 10,
) => {
  const skip = (page - 1) * limit;

  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      recruiterId,
    },
  });

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where: {
        jobId,
      },
      include: {
        user: true,
        job: true,
        statusHistory: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
      skip,
      take: limit,
    }),

    prisma.application.count({
      where: {
        jobId,
      },
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
export const createApplicationService = async (
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

  const application = await prisma.$transaction(async (tx) => {
    const app = await tx.application.create({
      data: {
        userId,
        jobId,
        coverLetter,
        resumeUrl,
      },
    });

    await tx.applicationStatusHistory.create({
      data: {
        applicationId: app.id,
        status: "PENDING",
      },
    });

    return app;
  });

  return application;
};
export const withdrawApplicationService = async (
  applicationId: string,
  candidateId: string,
) => {
  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId: candidateId },
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  if (!["PENDING", "REVIEWING"].includes(application.status)) {
    throw new AppError("This application can no longer be withdrawn", 400);
  }

  const [updated] = await prisma.$transaction([
    prisma.application.update({
      where: { id: applicationId },
      data: { status: "WITHDRAWN" },
    }),
    prisma.applicationStatusHistory.create({
      data: {
        applicationId,
        status: "WITHDRAWN",
        changedById: null,
      },
    }),
  ]);

  return updated;
};

const allowedTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
  PENDING: ["REVIEWING", "REJECTED"],
  REVIEWING: ["SHORTLISTED", "REJECTED"],
  SHORTLISTED: ["ACCEPTED", "REJECTED"],
  ACCEPTED: [],
  REJECTED: [],
  WITHDRAWN: [],
};

export const updateApplicationService = async (
  applicationId: string,
  recruiterId: string,
  data: UpdateApplicationInput,
) => {
  const application = await prisma.application.findFirst({
    where: { id: applicationId, job: { recruiterId } },
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  if (data.status && data.status !== application.status) {
    const allowed = allowedTransitions[application.status];
    if (!allowed.includes(data.status)) {
      throw new AppError(
        `Cannot change status from ${application.status} to ${data.status}`,
        400,
      );
    }
  }

  const [updated] = await prisma.$transaction([
    prisma.application.update({
      where: { id: applicationId },
      data,
    }),
    ...(data.status
      ? [
          prisma.applicationStatusHistory.create({
            data: {
              applicationId,
              status: data.status,
              changedById: recruiterId,
              note: data.recruiterNotes,
            },
          }),
        ]
      : []),
  ]);

  return updated;
};
