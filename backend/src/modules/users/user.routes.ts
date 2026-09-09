import express from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  changePasswordController,
  getMeController,
  getUsersController,
  updateProfileController,
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
router.patch("/me", requireAuth, asyncHandler(updateProfileController));
router.patch(
  "/change-password",
  requireAuth,
  asyncHandler(changePasswordController),
);
export default router;
