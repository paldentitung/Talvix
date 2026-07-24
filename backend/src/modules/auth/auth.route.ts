import express from "express";
import {
  forgotPasswordController,
  loginController,
  registerController,
} from "./auth.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { resetPasswordService } from "./auth.service.js";

const router = express.Router();

router.post("/register", asyncHandler(registerController));
router.post("/login", asyncHandler(loginController));
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordService);

export default router;
