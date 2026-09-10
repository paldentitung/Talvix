import { Prisma } from "@prisma/client";

export const userResponseSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,

  avatar: true,
  phone: true,

  isVerified: true,

  createdAt: true,
  updatedAt: true,

  candidateProfile: {
    select: {
      bio: true,
      location: true,
      title: true,
      resumeUrl: true,
      skills: true,
    },
  },

  recruiterProfile: {
    select: {
      companyName: true,
      companyLogo: true,
      companyWebsite: true,
      companyDescription: true,
      companyLocation: true,
      companyTagline: true,
      companyIndustry: true,
      companySize: true,
    },
  },
} satisfies Prisma.UserSelect;

export type UserResponsePayload = Prisma.UserGetPayload<{
  select: typeof userResponseSelect;
}>;
