import { Prisma } from "@prisma/client";

export const jobSelect = Prisma.validator<Prisma.JobSelect>()({
  id: true,
  title: true,
  description: true,

  salaryMin: true,
  salaryMax: true,
  currency: true,

  location: true,

  workMode: true,

  employmentType: true,

  experienceLevel: true,

  skills: true,

  openings: true,

  deadline: true,

  featured: true,

  status: true,

  recruiterId: true,

  recruiter: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatar: true,
      recruiterProfile: {
        select: {
          companyName: true,
          companyLogo: true,
          companyWebsite: true,
        },
      },
    },
  },

  createdAt: true,

  updatedAt: true,
});

export type JobResponse = Prisma.JobGetPayload<{
  select: typeof jobSelect;
}>;
