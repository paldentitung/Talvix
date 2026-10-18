import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createReportController,
  getReportByIdController,
  getReportsController,
  updateReportStatusController,
  getReportStatsController,
} from "./report.controller.js";
import { requireRole } from "../../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(getReportsController),
);

router.get(
  "/stats",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(getReportStatsController),
);

router.get(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(getReportByIdController),
);

router.post("/", requireAuth, asyncHandler(createReportController));

router.patch(
  "/:id/status",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(updateReportStatusController),
);
export default router;
