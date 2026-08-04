import { JobResponse, jobSelect } from "./job.select.js";
import prisma from "../../lib/prisma.js";
import { CreateJobInput, UpdateJobInput } from "./job.types.js";

export const getJobsService = async (): Promise<JobResponse[]> => {
  const jobs = await prisma.job.findMany({
    select: jobSelect,
  });

  return jobs;
};

export const getRecruiterJobsService = async (
  userId: string | undefined,
  userRole: string | undefined,
): Promise<JobResponse[]> => {
  const jobs = await prisma.job.findMany({
    where: userRole === "ADMIN" ? {} : { recruiterId: userId },
    select: jobSelect,
  });

  return jobs;
};

export const getJobService = async (
  jobId: string,
): Promise<JobResponse | null> => {
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
    select: jobSelect,
  });

  return job;
};

export const createJobService = async (
  data: CreateJobInput,
  recruiterId: string,
): Promise<JobResponse> => {
  const job = await prisma.job.create({
    data: {
      title: data.title,
      description: data.description,

      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      currency: data.currency,

      location: data.location,

      workMode: data.workMode,

      employmentType: data.employmentType,

      experienceLevel: data.experienceLevel,

      skills: data.skills,

      openings: data.openings,

      deadline: data.deadline,

      featured: data.featured,

      status: data.status,

      recruiterId,
    },
    select: jobSelect,
  });

  return job;
};

export const updateJobService = async (
  jobId: string,
  data: UpdateJobInput,
  userId: string,
  role: string,
) => {
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  if (job.recruiterId !== userId && role !== "ADMIN") {
    throw new Error("You cannot update this job");
  }

  return prisma.job.update({
    where: {
      id: jobId,
    },
    data: {
      title: data.title,
      description: data.description,

      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      currency: data.currency,

      location: data.location,

      workMode: data.workMode,

      employmentType: data.employmentType,

      experienceLevel: data.experienceLevel,

      skills: data.skills,

      openings: data.openings,

      deadline: data.deadline,

      featured: data.featured,

      status: data.status,
    },
    select: jobSelect,
  });
};

export const deleteJobService = async (
  jobId: string,
  userId: string,
  role: string,
) => {
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  if (job.recruiterId !== userId && role !== "ADMIN") {
    throw new Error("You cannot delete this job");
  }

  return prisma.job.delete({
    where: {
      id: jobId,
    },
    select: jobSelect,
  });
};
