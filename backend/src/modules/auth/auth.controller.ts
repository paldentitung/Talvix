import { Request, Response } from "express";
import { loginService, registerService } from "./auth.service.js";

export const registerController = async (req: Request, res: Response) => {
  const result = await registerService(req.body);

  res.status(201).json({
    success: true,
    message: "Register successfully",
    data: result,
  });
};
export const loginController = async (req: Request, res: Response) => {
  const result = await loginService(req.body);

  res.status(200).json({
    success: true,
    message: "Login successfully",
    data: result,
  });
};
