import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createJobController,
  deleteJobController,
  getAdminJobsController,
  getJobController,
  getJobsController,
  getRecruiterJobsController,
  getSavedJobsController,
  saveJobController,
  updateJobController,
  updateJobStatusController,
} from "./job.controller.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createJobSchema, updateJobSchema } from "./job.types.js";

const router = express.Router();

router.get("/", asyncHandler(getJobsController));
router.get("/me", requireAuth, asyncHandler(getRecruiterJobsController));
router.get("/saved", requireAuth, asyncHandler(getSavedJobsController));
router.get(
  "/admin",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(getAdminJobsController),
);
router.patch(
  "/:id/status",
  requireAuth,
  asyncHandler(updateJobStatusController),
);
router.get("/:id", requireAuth, asyncHandler(getJobController));
router.post(
  "/",
  requireAuth,
  requireRole("RECRUITER", "ADMIN"),
  validate(createJobSchema),
  asyncHandler(createJobController),
);
router.patch(
  "/:id",
  requireAuth,
  requireRole("RECRUITER", "ADMIN"),
  validate(updateJobSchema),
  asyncHandler(updateJobController),
);
router.delete(
  "/:id",
  requireAuth,
  requireRole("RECRUITER", "ADMIN"),
  asyncHandler(deleteJobController),
);

router.post("/:id/save-toggle", requireAuth, asyncHandler(saveJobController));
export default router;
