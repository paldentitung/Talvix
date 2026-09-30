import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  changePasswordController,
  getUsersController,
  updateCandidateProfileController,
  updateRecruiterProfileController,
  updateUserController,
  updateRecruiterLogoController,
  updateUserAvatarController,
  removeUserAvatarController,
  uploadCandidateResumeController,
  removeCandidateResumeController,
  addCandidateEducationController,
  updateCandidateEducationController,
  deleteCandidateEducationController,
  addCandidateExperienceController,
  updateCandidateExperienceController,
  deleteCandidateExperienceController,
  getUserInformationController,
} from "./user.controller.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  addCandidateEducationSchema,
  changePasswordSchema,
  updateCandidateProfileSchema,
  updateRecruiterProfileSchema,
  updateUserSchema,
  addCandidateExperienceSchema,
} from "./user.validation.js";
import {
  uploadAvatar,
  uploadCompanyLogo,
} from "../../middleware/upload.middleware.js";
import { uploadResume } from "../../middleware/upload.middleware.js";

const router = express.Router();

router.get(
  "/all",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(getUsersController),
);

router.get("/me", requireAuth, asyncHandler(getUserInformationController));
router.patch(
  "/profile",
  requireAuth,
  validate(updateUserSchema),
  updateUserController,
);
router.patch(
  "/profile/candidate",
  requireAuth,
  requireRole("CANDIDATE"),
  validate(updateCandidateProfileSchema),
  updateCandidateProfileController,
);
router.patch(
  "/profile/recruiter",
  requireAuth,
  requireRole("RECRUITER"),
  validate(updateRecruiterProfileSchema),
  updateRecruiterProfileController,
);
router.patch(
  "/change-password",
  requireAuth,
  validate(changePasswordSchema),
  asyncHandler(changePasswordController),
);
router.patch(
  "/profile/recruiter/logo",
  requireAuth,
  requireRole("RECRUITER"),
  uploadCompanyLogo,
  asyncHandler(updateRecruiterLogoController),
);

router.patch(
  "/profile/avatar",
  requireAuth,
  requireRole("CANDIDATE"),
  uploadAvatar,
  asyncHandler(updateUserAvatarController),
);

router.delete(
  "/profile/avatar",
  requireAuth,
  requireRole("CANDIDATE"),
  asyncHandler(removeUserAvatarController),
);
router.patch(
  "/resume",
  requireAuth,
  requireRole("CANDIDATE"),
  uploadResume,
  asyncHandler(uploadCandidateResumeController),
);
router.delete(
  "/resume",
  requireAuth,
  requireRole("CANDIDATE"),
  asyncHandler(removeCandidateResumeController),
);

router.post(
  "/candidate/education",
  requireAuth,
  requireRole("CANDIDATE"),
  validate(addCandidateEducationSchema),
  asyncHandler(addCandidateEducationController),
);
router.put(
  "/candidate/education/:educationId",
  requireAuth,
  validate(addCandidateEducationSchema),
  requireRole("CANDIDATE"),
  asyncHandler(updateCandidateEducationController),
);
router.delete(
  "/candidate/education/:educationId",
  requireAuth,
  requireRole("CANDIDATE"),
  asyncHandler(deleteCandidateEducationController),
);
router.post(
  "/candidate/experience",
  requireAuth,
  requireRole("CANDIDATE"),
  validate(addCandidateExperienceSchema),
  asyncHandler(addCandidateExperienceController),
);

router.put(
  "/candidate/experience/:experienceId",
  requireAuth,
  requireRole("CANDIDATE"),
  validate(addCandidateExperienceSchema),
  asyncHandler(updateCandidateExperienceController),
);

router.delete(
  "/candidate/experience/:experienceId",
  requireAuth,
  requireRole("CANDIDATE"),
  asyncHandler(deleteCandidateExperienceController),
);
export default router;
