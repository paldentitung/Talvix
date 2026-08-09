import prisma from "../../lib/prisma.js";
import AppError from ".././../utils/AppError.js";
import { CreateApplicationInput } from "./application.types.js";

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
