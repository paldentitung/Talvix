import { Request, Response } from "express";
import {
  forgotPasswordService,
  getMeService,
  loginService,
  registerService,
  resetPasswordService,
  verifyEmailService,
  googleLoginService,
} from "./auth.service.js";
import { signToken } from "../../utils/jwt.js";
import { clearAuthCookie, setAuthCookie } from "../../utils/cookies.js";
import { getGoogleAuthUrl, getGoogleUser } from "./googleOAuth.js";
import AppError from "../../utils/AppError.js";

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

export const googleAuthController = (req: Request, res: Response) => {
  const role = req.query.role;
  const validRole =
    role === "CANDIDATE" || role === "RECRUITER" ? role : undefined;

  const url = getGoogleAuthUrl(validRole);
  res.redirect(url);
};

export const googleCallbackController = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;

    if (typeof code !== "string") {
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=${encodeURIComponent(
          "Google authorization code is missing",
        )}`,
      );
    }

    const roleFromState =
      state === "CANDIDATE" || state === "RECRUITER" ? state : undefined;

    const googleUser = await getGoogleUser(code);
    const user = await googleLoginService(googleUser, roleFromState);

    const token = signToken({ id: user.id, role: user.role });
    setAuthCookie(res, token);

    switch (user.role) {
      case "ADMIN":
        return res.redirect(`${process.env.CLIENT_URL}/admin/dashboard`);
      case "RECRUITER":
        return res.redirect(`${process.env.CLIENT_URL}/recruiter/dashboard`);
      case "CANDIDATE":
        return res.redirect(`${process.env.CLIENT_URL}/candidate/dashboard`);
      default:
        return res.redirect(`${process.env.CLIENT_URL}/`);
    }
  } catch (error) {
    const message =
      error instanceof AppError
        ? error.message
        : "Google authentication failed";

    return res.redirect(
      `${process.env.CLIENT_URL}/login?error=${encodeURIComponent(message)}`,
    );
  }
};
