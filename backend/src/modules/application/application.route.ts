import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createApplicationController } from "./application.controller.js";
import { requireRole } from "../../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRole("CANDIDATE"),
  asyncHandler(createApplicationController),
);

export default router;
