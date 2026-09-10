import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import { companySelect } from "./company.select.js";
import { jobSelect } from "../jobs/job.select.js";

export const getCompaniesService = async (
  page = 1,
  pageSize = 10,
  search?: string,
) => {
  const where: Prisma.UserWhereInput = {
    role: "RECRUITER",
    recruiterProfile: {
      companyName: { not: null },
      ...(search && {
        companyName: { contains: search, mode: "insensitive" },
      }),
    },
  };

  const [companies, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: companySelect,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { recruiterProfile: { companyName: "asc" } },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    companies,
    total,
    page,
    totalPages: Math.ceil(total / pageSize),
  };
};

export const getCompanyByIdService = async (recruiterId: string) => {
  const company = await prisma.user.findFirst({
    where: { id: recruiterId, role: "RECRUITER" },
    select: {
      ...companySelect,
      jobs: {
        where: { status: "OPEN" },
        select: {
          ...jobSelect,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return company;
};
