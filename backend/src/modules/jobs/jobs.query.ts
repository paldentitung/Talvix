import prisma from "../../lib/prisma.js";
import type { Prisma } from "@prisma/client";
import { jobSelect } from "./job.select.js";
import type { JobFilters, JobStatus } from "./job.types.js";

export const SORTS = {
  relevant: [{ featured: "desc" }, { createdAt: "desc" }, { id: "desc" }],
  newest: [{ createdAt: "desc" }, { id: "desc" }],
  salary_desc: [{ salaryMax: { sort: "desc", nulls: "last" } }, { id: "desc" }],
} satisfies Record<string, Prisma.JobOrderByWithRelationInput[]>;

export const buildJobWhere = (
  status: JobStatus | undefined,
  search?: string,
  filters?: JobFilters,
): Prisma.JobWhereInput => {
  const and: Prisma.JobWhereInput[] = [];

  if (status) and.push({ status });

  if (search) {
    and.push({
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { skills: { has: search } },
      ],
    });
  }
  if (filters?.location)
    and.push({ location: { contains: filters.location, mode: "insensitive" } });
  if (filters?.workMode) and.push({ workMode: filters.workMode });
  if (filters?.employmentType)
    and.push({ employmentType: filters.employmentType });
  if (filters?.experienceLevel)
    and.push({ experienceLevel: filters.experienceLevel });
  if (filters?.skills?.length)
    and.push({ skills: { hasSome: filters.skills } });
  if (filters?.currency) and.push({ currency: filters.currency });
  if (filters?.minSalary !== undefined)
    and.push({ salaryMax: { gte: filters.minSalary } });
  if (filters?.maxSalary !== undefined)
    and.push({ salaryMin: { lte: filters.maxSalary } });
  if (filters?.featuredOnly) and.push({ featured: true });

  return and.length ? { AND: and } : {};
};

export const queryJobs = async (
  where: Prisma.JobWhereInput,
  page: number,
  pageSize: number,
  orderBy: Prisma.JobOrderByWithRelationInput[] = [
    { createdAt: "desc" },
    { id: "desc" },
  ],
) => {
  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      select: jobSelect,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy,
    }),
    prisma.job.count({ where }),
  ]);
  return { jobs, total, page, totalPages: Math.ceil(total / pageSize) };
};
