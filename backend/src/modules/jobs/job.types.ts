import { z } from "zod";

export const createJobSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z.string().min(20, "Description must be at least 20 characters"),

  salaryMin: z.number().positive().optional(),

  salaryMax: z.number().positive().optional(),

  currency: z.string().default("NPR"),

  location: z.string().min(2, "Location is required"),

  workMode: z.enum(["ONSITE", "REMOTE", "HYBRID"], {
    message: "Invalid work mode",
  }),

  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"], {
    message: "Invalid employment type",
  }),

  experienceLevel: z.enum(["ENTRY", "MID", "SENIOR", "LEAD"], {
    message: "Invalid experience level",
  }),

  skills: z.array(z.string()).min(1, "At least one skill is required"),

  openings: z.number().int().positive().optional(),

  deadline: z.coerce.date().optional(),

  featured: z.boolean().optional(),

  status: z.enum(["DRAFT", "OPEN", "CLOSED"], {
    message: "Invalid job status",
  }),
});

export const updateJobSchema = createJobSchema.partial();

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
