import { z } from "zod";

export const updateUserSchema = z
  .object({
    firstName: z.string().min(1, "First name cannot be empty").optional(),
    lastName: z.string().min(1, "Last name cannot be empty").optional(),
    phone: z.string().min(7, "Phone number is too short").optional(),
    avatar: z.string().url("Avatar must be a valid URL").optional(),
  })
  .strict();

export const updateCandidateProfileSchema = z
  .object({
    bio: z.string().max(2000, "Bio is too long").optional(),
    location: z.string().max(200).optional(),
    title: z.string().max(200).optional(),
    resumeUrl: z.string().url("Resume URL must be valid").optional(),
    skills: z.array(z.string().min(1)).max(50, "Too many skills").optional(),
  })
  .strict();

export const updateRecruiterProfileSchema = z
  .object({
    companyName: z.string().max(200).optional(),
    companyLogo: z.string().url("Logo must be a valid URL").optional(),
    companyWebsite: z.string().url("Website must be a valid URL").optional(),
    companyDescription: z.string().max(3000).optional(),
    companyLocation: z.string().max(200).optional(),
    companyTagline: z.string().optional(),
    companyIndustry: z.string().optional(),
    companySize: z.string().optional(),
  })
  .strict();
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(100, "New password is too long")
      .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
      .regex(/[a-z]/, "New password must contain at least one lowercase letter")
      .regex(/[0-9]/, "New password must contain at least one number"),
  })
  .strict()
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });
export const addCandidateEducationSchema = z
  .object({
    school: z
      .string()
      .min(1, "School is required")
      .max(200, "School name is too long"),

    degree: z
      .string()
      .min(1, "Degree is required")
      .max(200, "Degree is too long"),

    startDate: z.coerce.date({
      message: "Start date must be a valid date",
    }),

    endDate: z.coerce
      .date({
        message: "End date must be a valid date",
      })
      .nullable()
      .optional(),
  })
  .strict()
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: "End date cannot be before start date",
    path: ["endDate"],
  });

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateCandidateProfileInput = z.infer<
  typeof updateCandidateProfileSchema
>;
export type UpdateRecruiterProfileInput = z.infer<
  typeof updateRecruiterProfileSchema
>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type AddCandidateEducationInput = z.infer<
  typeof addCandidateEducationSchema
>;
