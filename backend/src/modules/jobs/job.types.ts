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
export interface JobFilters {
  status?: JobStatus;
  location?: string;
  workMode?: z.infer<typeof createJobSchema>["workMode"];
  employmentType?: z.infer<typeof createJobSchema>["employmentType"];
  experienceLevel?: z.infer<typeof createJobSchema>["experienceLevel"];
  skills?: string[];
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
}
export const jobFiltersSchema = z.object({
  status: z.enum(["DRAFT", "OPEN", "CLOSED"]).optional(),
  location: z.string().optional(),
  workMode: z.enum(["ONSITE", "REMOTE", "HYBRID"]).optional(),
  employmentType: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"])
    .optional(),
  experienceLevel: z.enum(["ENTRY", "MID", "SENIOR", "LEAD"]).optional(),
  skills: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",") : undefined)),
  minSalary: z.coerce.number().positive().optional(),
  maxSalary: z.coerce.number().positive().optional(),
  currency: z.string().optional(),
});
export type JobFiltersInput = z.infer<typeof jobFiltersSchema>;
