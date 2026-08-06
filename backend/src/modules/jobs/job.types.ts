import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20),

  salaryMin: z.number().positive().nullable().optional(),
  salaryMax: z.number().positive().nullable().optional(),

  currency: z.string().default("NPR"),

  location: z.string().min(2),

  workMode: z.enum(["ONSITE", "REMOTE", "HYBRID"]),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]),
  experienceLevel: z.enum(["ENTRY", "MID", "SENIOR", "LEAD"]),

  skills: z.array(z.string()).min(1),

  openings: z.number().int().positive().nullable().optional(),

  deadline: z.coerce.date().nullable().optional(),

  featured: z.boolean().optional(),

  status: z.enum(["DRAFT", "OPEN", "CLOSED"]).optional(),
});

export const updateJobSchema = createJobSchema.partial();

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type JobStatus = "OPEN" | "DRAFT" | "CLOSED";
