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

const jobFiltersBase = z.object({
  location: z.string().trim().optional(),
  workMode: z.enum(["ONSITE", "REMOTE", "HYBRID"]).optional(),
  employmentType: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"])
    .optional(),
  experienceLevel: z.enum(["ENTRY", "MID", "SENIOR", "LEAD"]).optional(),
  skills: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
    ),
  minSalary: z.coerce.number().positive().optional(),
  maxSalary: z.coerce.number().positive().optional(),
  currency: z.string().optional(),
  featuredOnly: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  sort: z.enum(["relevant", "newest", "salary_desc"]).optional(),
});

const salaryRangeValid = (f: { minSalary?: number; maxSalary?: number }) =>
  f.minSalary === undefined ||
  f.maxSalary === undefined ||
  f.minSalary <= f.maxSalary;

const salaryRangeError = {
  message: "minSalary cannot be greater than maxSalary",
  path: ["minSalary"],
};

// public + candidate: no status
export const jobFiltersSchema = jobFiltersBase.refine(
  salaryRangeValid,
  salaryRangeError,
);
export type JobFilters = z.infer<typeof jobFiltersSchema>;

// admin / employer: adds status
export const adminJobFiltersSchema = jobFiltersBase
  .extend({ status: z.enum(["DRAFT", "OPEN", "CLOSED"]).optional() })
  .refine(salaryRangeValid, salaryRangeError);
export type AdminJobFilters = z.infer<typeof adminJobFiltersSchema>;
