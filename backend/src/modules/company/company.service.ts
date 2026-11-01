import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import { companySelect } from "./company.select.js";
import { jobSelect } from "../jobs/job.select.js";

export const getCompaniesService = async (
  page = 1,
  pageSize = 10,
  search?: string,
  isVerified?: boolean,
) => {
  const term = search?.trim();

  const where: Prisma.UserWhereInput = {
    role: "RECRUITER",
    ...(isVerified !== undefined && { isVerified }),
    ...(term && {
      recruiterProfile: {
        companyName: { contains: term, mode: "insensitive" },
      },
    }),
  };

  const [companies, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: companySelect,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: [{ recruiterProfile: { companyName: "asc" } }, { id: "asc" }],
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
