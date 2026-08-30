import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createApplicationController,
  getApplicationByIdController,
  getApplicationsController,
  getMyApplicationsController,
  getRecruiterApplicationsController,
  withdrawApplicationController,
  updateApplicationController,
} from "./application.controller.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { uploadResume } from "../../middleware/upload.middleware.js";

const router = express.Router();

router.get(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(getApplicationsController),
);

router.get(
  "/recruiter",
  requireAuth,
  requireRole("RECRUITER"),
  asyncHandler(getRecruiterApplicationsController),
);

router.get(
  "/me",
  requireAuth,
  requireRole("CANDIDATE"),
  asyncHandler(getMyApplicationsController),
);

router.get("/:id", requireAuth, asyncHandler(getApplicationByIdController));

router.post(
  "/",
  requireAuth,
  requireRole("CANDIDATE"),
  uploadResume,
  asyncHandler(createApplicationController),
);

router.delete(
  "/:id/withdraw",
  requireAuth,
  requireRole("CANDIDATE"),
  asyncHandler(withdrawApplicationController),
);
router.patch(
  "/:id",
  requireAuth,
  requireRole("RECRUITER"),
  asyncHandler(updateApplicationController),
);
export default router;
