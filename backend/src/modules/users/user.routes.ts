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

const router = express.Router();

router.get("/me", requireAuth, asyncHandler(getMeController));
router.get(
  "/all",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(getUsersController),
);
router.patch("/profile", requireAuth, updateUserController);
router.patch(
  "/profile/candidate",
  requireAuth,
  requireRole("CANDIDATE"),
  updateCandidateProfileController,
);
router.patch(
  "/profile/recruiter",
  requireAuth,
  requireRole("RECRUITER"),
  updateRecruiterProfileController,
);
router.patch(
  "/change-password",
  requireAuth,
  asyncHandler(changePasswordController),
);
export default router;
