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

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateCandidateProfileInput = z.infer<
  typeof updateCandidateProfileSchema
>;
export type UpdateRecruiterProfileInput = z.infer<
  typeof updateRecruiterProfileSchema
>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
