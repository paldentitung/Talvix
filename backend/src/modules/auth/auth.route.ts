import express from "express";
import {
  forgotPasswordController,
  getMeController,
  loginController,
  logoutController,
  registerController,
  resetPasswordController,
  verifyEmailController,
  googleAuthController,
  googleCallbackController,
} from "./auth.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  forgotPasswordLimiter,
  loginLimiter,
  registerLimiter,
  resetPasswordLimiter,
  verifyEmailLimiter,
} from "../../middleware/rateLimit.middleware.js";

const router = express.Router();

router.get("/me", requireAuth, asyncHandler(getMeController));
router.post("/register", registerLimiter, asyncHandler(registerController));
router.get(
  "/verify-email/:token",
  verifyEmailLimiter,
  asyncHandler(verifyEmailController),
);
router.post("/login", loginLimiter, asyncHandler(loginController));
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  asyncHandler(forgotPasswordController),
);
router.post(
  "/reset-password",
  resetPasswordLimiter,
  asyncHandler(resetPasswordController),
);
router.post("/logout", requireAuth, asyncHandler(logoutController));
router.get("/google", loginLimiter, googleAuthController);
router.get(
  "/google/callback",
  loginLimiter,
  asyncHandler(googleCallbackController),
);

export default router;
