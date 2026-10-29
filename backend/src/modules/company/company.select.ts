import prisma from "../../lib/prisma.js";
import { Prisma } from "@prisma/client";

export const companySelect = {
  id: true,
  firstName: true,
  lastName: true,
  avatar: true,
  isVerified: true,
  createdAt: true,
  status: true,
  recruiterProfile: {
    select: {
      companyName: true,
      companyLogo: true,
      companyWebsite: true,
      companyDescription: true,
      companyLocation: true,
      companyTagline: true,
    },
  },
  _count: {
    select: {
      jobs: { where: { status: "OPEN" } },
    },
  },
} satisfies Prisma.UserSelect;
