import { JobResponse, jobSelect } from "./job.select.js";
import prisma from "../../lib/prisma.js";
import {
  CreateJobInput,
  JobStatus,
  UpdateJobInput,
  JobFilters,
  AdminJobFilters,
} from "./job.types.js";
import AppError from "../../utils/AppError.js";
import { Prisma } from "@prisma/client";
import { buildJobWhere, queryJobs, SORTS } from "./jobs.query.js";

export const getPublicJobsService = (
  page = 1,
  pageSize = 10,
  search?: string,
  filters?: JobFilters,
) =>
  queryJobs(
    buildJobWhere("OPEN", search, filters),
    page,
    pageSize,
    SORTS[filters?.sort ?? "newest"],
  );

export const getRecruiterJobsService = async (
  userId: string | undefined,
  userRole: string | undefined,
  page = 1,
  limit = 10,
) => {
  const skip = (page - 1) * limit;

  const where = userRole === "ADMIN" ? {} : { recruiterId: userId };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      select: jobSelect,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.job.count({
      where,
    }),
  ]);

  const counts = await prisma.application.groupBy({
    by: ["jobId"],
    where: {
      jobId: {
        in: jobs.map((j) => j.id),
      },
    },
    _count: true,
  });

  const countMap = new Map(counts.map((c) => [c.jobId, c._count]));

  const jobsWithApplications = jobs.map((job) => ({
    ...job,
    applicationsCount: countMap.get(job.id) ?? 0,
  }));

  return {
    jobs: jobsWithApplications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
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

export const saveJobService = async (userId: string, jobId: string) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  const existing = await prisma.savedJob.findUnique({
    where: {
      userId_jobId: {
        userId,
        jobId,
      },
    },
  });

  if (existing) {
    await prisma.savedJob.delete({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    return {
      saved: false,
    };
  }

  await prisma.savedJob.create({
    data: {
      userId,
      jobId,
    },
  });

  return {
    saved: true,
  };
};
export const getSavedJobsService = async (userId: string) => {
  return prisma.savedJob.findMany({
    where: {
      userId,
    },
    include: {
      job: {
        include: {
          recruiter: {
            include: {
              recruiterProfile: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
export const getAdminJobsService = (
  page = 1,
  pageSize = 10,
  search?: string,
  filters?: AdminJobFilters,
) =>
  queryJobs(
    buildJobWhere(filters?.status, search, filters),
    page,
    pageSize,
    SORTS[filters?.sort ?? "newest"],
  );
export const getCandidateJobsService = (
  page = 1,
  pageSize = 10,
  search?: string,
  filters?: JobFilters,
) =>
  queryJobs(
    buildJobWhere("OPEN", search, filters),
    page,
    pageSize,
    SORTS[filters?.sort ?? "newest"],
  );
