import {
  getMeService,
  changePasswordService,
  updateProfileService,
  getUsersService,
} from "./user.service.js";
import { Request, Response } from "express";

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

export const updateProfileController = async (req: Request, res: Response) => {
  const result = await updateProfileService(req.user!.id, req.body);
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
};

export const getUsersController = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await getUsersService(page, limit);
  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
};
