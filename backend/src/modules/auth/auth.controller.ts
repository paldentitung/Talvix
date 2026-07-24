import { Request, Response } from "express";
import {
  forgotPasswordService,
  getMeService,
  loginService,
  registerService,
  resetPasswordService,
  verifyEmailService,
  changePasswordService,
} from "./auth.service.js";
import { signToken } from "../../utils/jwt.js";
import { clearAuthCookie, setAuthCookie } from "../../utils/cookies.js";

export const registerController = async (req: Request, res: Response) => {
  const result = await registerService(req.body);

  const token = signToken({ id: result.id, role: result.role });
  setAuthCookie(res, token);

  res.status(201).json({
    success: true,
    message: "Register successfully",
    data: result,
  });
};

export const verifyEmailController = async (req: Request, res: Response) => {
  const { token } = req.params;

  if (typeof token !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid verification token",
    });
  }

  const result = await verifyEmailService({ token });

  res.status(200).json(result);
};

export const loginController = async (req: Request, res: Response) => {
  const result = await loginService(req.body);

  const token = signToken({ id: result.id, role: result.role });
  setAuthCookie(res, token);

  res.status(200).json({
    success: true,
    message: "Login successfully",
    data: result,
  });
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  await forgotPasswordService(req.body);
  res.status(200).json({
    success: true,
    message: "Email send successfully",
  });
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const result = await resetPasswordService(req.body);
  res.status(200).json(result);
};

export const logoutController = async (req: Request, res: Response) => {
  clearAuthCookie(res);
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const getMeController = async (req: Request, res: Response) => {
  const result = await getMeService(req.user!.id);
  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: result,
  });
};

export const changePasswordController = async (req: Request, res: Response) => {
  const result = await changePasswordService(req.user!.id, req.body);
  res.status(200).json(result);
};
