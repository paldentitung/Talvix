import { getMeService, changePasswordService } from "./user.service.js";
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
