import { Prisma } from "@prisma/client";

export const userResponseSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,

  avatar: true,
  phone: true,
  bio: true,
  location: true,
  title: true,
  resumeUrl: true,

  companyName: true,
  companyLogo: true,
  companyWebsite: true,
  companyDescription: true,

  isVerified: true,

  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type UserResponsePayload = Prisma.UserGetPayload<{
  select: typeof userResponseSelect;
}>;
