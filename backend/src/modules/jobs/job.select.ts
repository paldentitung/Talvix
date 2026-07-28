import { Prisma } from "@prisma/client";

export const jobSelect = Prisma.validator<Prisma.JobSelect>()({
  id: true,
  title: true,
  description: true,
  salary: true,
  location: true,
  employmentType: true,
  experience: true,
  skills: true,
  deadline: true,
  status: true,
  recruiterId: true,
  createdAt: true,
  updatedAt: true,
});

export type JobResponse = Prisma.JobGetPayload<{
  select: typeof jobSelect;
}>;
