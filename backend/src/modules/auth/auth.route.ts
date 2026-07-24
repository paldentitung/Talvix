import express from "express";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resetPasswordController,
  verifyEmailController,
} from "./auth.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();

router.post("/register", asyncHandler(registerController));
router.get("/verify-email/:token", asyncHandler(verifyEmailController));
router.post("/login", asyncHandler(loginController));
router.post("/forgot-password", asyncHandler(forgotPasswordController));
router.post("/reset-password", asyncHandler(resetPasswordController));
router.get("/logout", asyncHandler(logoutController));
export default router;
