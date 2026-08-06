import { JobResponse, jobSelect } from "./job.select.js";
import prisma from "../../lib/prisma.js";
import {
  CreateJobInput,
  JobStatus,
  UpdateJobInput,
  JobFilters,
} from "./job.types.js";
import AppError from "../../utils/AppError.js";
import { Prisma } from "@prisma/client";

export const getJobsService = async (
  page = 1,
  pageSize = 10,
  search?: string,
  filters?: JobFilters,
): Promise<{
  jobs: JobResponse[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const where: Prisma.JobWhereInput = {
    status: "OPEN",
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { skills: { hasSome: [search] } },
      ],
    }),
    ...(filters?.location && {
      location: { contains: filters.location, mode: "insensitive" },
    }),
    ...(filters?.workMode && { workMode: filters.workMode }),
    ...(filters?.employmentType && { employmentType: filters.employmentType }),
    ...(filters?.experienceLevel && {
      experienceLevel: filters.experienceLevel,
    }),
    ...(filters?.skills?.length && { skills: { hasSome: filters.skills } }),
    ...(filters?.currency && { currency: filters.currency }),
    ...((filters?.minSalary !== undefined ||
      filters?.maxSalary !== undefined) && {
      OR: undefined, // see note below
      AND: [
        ...(filters.minSalary !== undefined
          ? [{ salaryMax: { gte: filters.minSalary } }]
          : []),
        ...(filters.maxSalary !== undefined
          ? [{ salaryMin: { lte: filters.maxSalary } }]
          : []),
      ],
    }),
  };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      select: jobSelect,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.job.count({ where }),
  ]);

  return {
    jobs,
    total,
    page,
    totalPages: Math.ceil(total / pageSize),
  };
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

export const updateJobStatusService = async (
  jobId: string,
  newStatus: JobStatus,
  userId: string,
  role: string,
) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  if (job.recruiterId !== userId && role !== "ADMIN") {
    throw new AppError("You cannot update this job", 403);
  }

  // block reopening a job past its deadline
  if (
    newStatus === "OPEN" &&
    job.status === "CLOSED" &&
    job.deadline &&
    new Date(job.deadline) < new Date()
  ) {
    throw new AppError("Cannot reopen a job past its deadline", 400);
  }

  return prisma.job.update({
    where: { id: jobId },
    data: { status: newStatus },
    select: jobSelect,
  });
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
      status: "DRAFT",
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
