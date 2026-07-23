import express from "express";
import { loginController, registerController } from "./auth.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();

router.post("/register", asyncHandler(registerController));
router.post("/login", asyncHandler(loginController));

export default router;
