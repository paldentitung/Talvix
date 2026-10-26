import express from "express";
import { ro } from "zod/locales";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { getAdminDashboardController } from "./dashboard.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();

router.get(
  "/admin",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(getAdminDashboardController),
);

export default router;
