import {
  changePasswordService,
  updateCandidateProfileService,
  updateUserService,
  updateRecruiterProfileService,
  getUsersService,
  updateRecruiterLogoService,
  updateUserAvatarService,
  removeUserAvatarService,
  uploadCandidateResumeService,
  removeCandidateResumeService,
  addCandidateEducationService,
  updateCandidateEducationService,
  deleteCandidateEducationService,
} from "./user.service.js";
import { Request, Response } from "express";
import AppError from "../../utils/AppError.js";

export const changePasswordController = async (req: Request, res: Response) => {
  const result = await changePasswordService(req.user!.id, req.body);
  res.status(200).json(result);
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
export const updateUserController = async (req: Request, res: Response) => {
  const result = await updateUserService(req.user!.id, req.body);
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
};

export const updateCandidateProfileController = async (
  req: Request,
  res: Response,
) => {
  const result = await updateCandidateProfileService(req.user!.id, req.body);
  res.status(200).json({
    success: true,
    message: "Candidate profile updated successfully",
    data: result,
  });
};

export const updateRecruiterProfileController = async (
  req: Request,
  res: Response,
) => {
  const result = await updateRecruiterProfileService(req.user!.id, req.body);
  res.status(200).json({
    success: true,
    message: "Recruiter profile updated successfully",
    data: result,
  });
};

export const updateRecruiterLogoController = async (
  req: Request,
  res: Response,
) => {
  if (!req.file) {
    throw new AppError("Company logo is required", 400);
  }

  const userId = req.user!.id;

  const logoUrl = `/uploads/company-logos/${req.file.filename}`;

  const user = await updateRecruiterLogoService(userId, logoUrl);

  res.status(200).json({
    message: "Company logo updated successfully",
    data: user,
  });
};

export const updateUserAvatarController = async (
  req: Request,
  res: Response,
) => {
  if (!req.file) {
    throw new AppError("Avatar is required", 400);
  }

  const userId = req.user!.id;

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;

  const user = await updateUserAvatarService(userId, avatarUrl);

  res.status(200).json({
    success: true,
    message: "Avatar updated successfully",
    data: user,
  });
};
export const removeUserAvatarController = async (
  req: Request,
  res: Response,
) => {
  const user = await removeUserAvatarService(req.user!.id);

  res.status(200).json({
    success: true,
    message: "Avatar removed successfully",
    data: user,
  });
};

export const uploadCandidateResumeController = async (
  req: Request,
  res: Response,
) => {
  if (!req.file) {
    throw new AppError("Resume is required", 400);
  }

  const userId = req.user!.id;
  const resumeUrl = `/uploads/resumes/${req.file.filename}`;

  const profile = await uploadCandidateResumeService(userId, resumeUrl);

  res.status(200).json({
    success: true,
    message: "Resume uploaded successfully",
    data: profile,
  });
};

export const removeCandidateResumeController = async (
  req: Request,
  res: Response,
) => {
  const result = await removeCandidateResumeService(req.user!.id);

  res.status(200).json({
    success: true,
    message: "Resume removed successfully",
    data: result,
  });
};

export const addCandidateEducationController = async (
  req: Request,
  res: Response,
) => {
  const result = await addCandidateEducationService(req.user!.id, req.body);
  res.status(200).json({
    success: true,
    message: "Education Added successfully",
    data: result,
  });
};
export const updateCandidateEducationController = async (
  req: Request<{ educationId: string }>,
  res: Response,
) => {
  const result = await updateCandidateEducationService(
    req.user!.id,
    req.params.educationId,
    req.body,
  );

  res.status(200).json({
    success: true,
    message: "Education updated successfully",
    data: result,
  });
};

export const deleteCandidateEducationController = async (
  req: Request<{ educationId: string }>,
  res: Response,
) => {
  const result = await deleteCandidateEducationService(
    req.user!.id,
    req.params.educationId,
  );

  res.status(200).json({
    success: true,
    message: "Education deleted successfully",
    data: result,
  });
};
