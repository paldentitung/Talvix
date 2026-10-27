import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import {
  getAdminDashboardController,
  getCandidateDashboardController,
  getRecruiterDashboardController,
} from "./dashboard.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();

router.get(
  "/admin",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(getAdminDashboardController),
);

router.get(
  "/recruiter",
  requireAuth,
  requireRole("RECRUITER"),
  asyncHandler(getRecruiterDashboardController),
);

router.get(
  "/candidate",
  requireAuth,
  requireRole("CANDIDATE"),
  asyncHandler(getCandidateDashboardController),
);

export default router;
