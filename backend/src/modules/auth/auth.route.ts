import express from "express";
import {
  forgotPasswordController,
  getMeController,
  loginController,
  logoutController,
  registerController,
  resetPasswordController,
  verifyEmailController,
} from "./auth.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", requireAuth, asyncHandler(getMeController));
router.post("/register", asyncHandler(registerController));
router.get("/verify-email/:token", asyncHandler(verifyEmailController));
router.post("/login", asyncHandler(loginController));
router.post("/forgot-password", asyncHandler(forgotPasswordController));
router.post("/reset-password", asyncHandler(resetPasswordController));
router.get("/logout", asyncHandler(logoutController));

export default router;
