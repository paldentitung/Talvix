import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createJobController,
  deleteJobController,
  getJobController,
  getJobsController,
  updateJobController,
} from "./job.controller.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createJobSchema, updateJobSchema } from "./job.types.js";

const router = express.Router();

router.get("/", asyncHandler(getJobsController));
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

export default router;
