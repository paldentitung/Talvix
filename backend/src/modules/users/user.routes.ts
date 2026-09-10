import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  changePasswordController,
  getMeController,
  getUsersController,
  updateCandidateProfileController,
  updateRecruiterProfileController,
  updateUserController,
} from "./user.controller.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  changePasswordSchema,
  updateCandidateProfileSchema,
  updateRecruiterProfileSchema,
  updateUserSchema,
} from "./user.validation.js";

const router = express.Router();

router.get("/me", requireAuth, asyncHandler(getMeController));
router.get(
  "/all",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(getUsersController),
);
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
export default router;
