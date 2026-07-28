import { z } from "zod";

export const createJobSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z.string().min(20, "Description must be at least 20 characters"),

  salary: z.number().positive("Salary must be greater than 0").optional(),

  location: z.string().min(2, "Location is required"),

  employmentType: z.enum(
    ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"],
    {
      message: "Invalid employment type",
    },
  ),

  experience: z.string().min(1, "Experience is required"),

  skills: z.array(z.string()).min(1, "At least one skill is required"),

  deadline: z.coerce.date(),

  status: z.enum(["ACTIVE", "CLOSED"], {
    message: "Invalid job status",
  }),
});

export const updateJobSchema = createJobSchema.partial();

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
