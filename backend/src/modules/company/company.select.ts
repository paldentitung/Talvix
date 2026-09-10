import prisma from "../../lib/prisma.js";
import { Prisma } from "@prisma/client";

export const companySelect = {
  id: true,
  firstName: true,
  lastName: true,
  isVerified: true,
  createdAt: true,
  recruiterProfile: {
    select: {
      companyName: true,
      companyLogo: true,
      companyWebsite: true,
      companyDescription: true,
    },
  },
  _count: {
    select: {
      jobs: { where: { status: "OPEN" } },
    },
  },
} satisfies Prisma.UserSelect;
