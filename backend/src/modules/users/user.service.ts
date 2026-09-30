import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import bcrypt from "bcrypt";
import { toUserResponse } from "./user.mapper.js";
import { userResponseSelect } from "./user.select.js";
import {
  UpdateUserInput,
  UpdateCandidateProfileInput,
  UpdateRecruiterProfileInput,
  ChangePasswordInput,
  AddCandidateEducationInput,
  AddCandidateExperienceInput,
} from "./user.validation.js";
import fs from "fs/promises";
import path from "path";

export const getUsersService = async (page: number, limit: number) => {
  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      select: userResponseSelect,
      skip: (page - 1) * limit,
      take: limit,
    }),

    prisma.user.count(),
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  return {
    users: users.map(toUserResponse),
    pagination: {
      page,
      limit,
      totalUsers,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};
export const changePasswordService = async (
  userId: string,
  data: ChangePasswordInput,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.password) {
    throw new AppError(
      "This account does not have a password. Please set a password first.",
      400,
    );
  }

  const isValidPassword = await bcrypt.compare(
    data.currentPassword,
    user.password,
  );

  if (!isValidPassword) {
    throw new AppError("Current password is incorrect", 400);
  }

  const isSamePassword = await bcrypt.compare(data.newPassword, user.password);

  if (isSamePassword) {
    throw new AppError(
      "New password must be different from current password",
      400,
    );
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return {
    success: true,
    message: "Password changed successfully",
  };
};

export const updateUserService = async (
  userId: string,
  data: UpdateUserInput,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("user not found", 404);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
    select: userResponseSelect,
  });

  return toUserResponse(updatedUser);
};

export const updateCandidateProfileService = async (
  userId: string,
  data: UpdateCandidateProfileInput,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("user not found", 404);
  if (user.role !== "CANDIDATE") throw new AppError("Forbidden", 403);

  await prisma.candidateProfile.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });

  const updatedUser = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: userResponseSelect,
  });

  return toUserResponse(updatedUser);
};

export const updateRecruiterProfileService = async (
  userId: string,
  data: UpdateRecruiterProfileInput,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("user not found", 404);
  if (user.role !== "RECRUITER") throw new AppError("Forbidden", 403);

  await prisma.recruiterProfile.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });

  const updatedUser = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: userResponseSelect,
  });

  return toUserResponse(updatedUser);
};
export const updateRecruiterLogoService = async (
  userId: string,
  logoUrl: string,
) => {
  return prisma.recruiterProfile.upsert({
    where: { userId },
    update: {
      companyLogo: logoUrl,
    },
    create: {
      userId,
      companyLogo: logoUrl,
    },
    select: {
      id: true,
      companyLogo: true,
    },
  });
};
export const updateUserAvatarService = async (
  userId: string,
  avatarUrl: string,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      avatar: avatarUrl,
    },
    select: userResponseSelect,
  });

  return toUserResponse(updatedUser);
};
export const removeUserAvatarService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.avatar) {
    throw new AppError("Avatar not found", 404);
  }

  const avatarPath = path.join(process.cwd(), user.avatar);

  try {
    await fs.unlink(avatarPath);
  } catch (error: any) {
    // File may already be missing; don't block database cleanup
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      avatar: null,
    },
    select: userResponseSelect,
  });

  return toUserResponse(updatedUser);
};

export const uploadCandidateResumeService = async (
  userId: string,
  resumeUrl: string,
) => {
  const profile = await prisma.candidateProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    throw new AppError("Candidate profile not found", 404);
  }

  if (profile.resumeUrl) {
    const oldResumePath = path.join(process.cwd(), profile.resumeUrl);

    try {
      await fs.unlink(oldResumePath);
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  const updatedProfile = await prisma.candidateProfile.update({
    where: {
      userId,
    },
    data: {
      resumeUrl,
    },
  });

  return updatedProfile;
};
export const removeCandidateResumeService = async (userId: string) => {
  const profile = await prisma.candidateProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    throw new AppError("Candidate profile not found", 404);
  }

  if (!profile.resumeUrl) {
    throw new AppError("Resume not found", 404);
  }

  const resumePath = path.join(process.cwd(), profile.resumeUrl);

  try {
    await fs.unlink(resumePath);
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  const updatedProfile = await prisma.candidateProfile.update({
    where: {
      userId,
    },
    data: {
      resumeUrl: null,
    },
  });

  return updatedProfile;
};

export const addCandidateEducationService = async (
  userId: string,
  data: AddCandidateEducationInput,
) => {
  const candidateProfile = await prisma.candidateProfile.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!candidateProfile) {
    throw new AppError("Candidate profile not found", 404);
  }

  const education = await prisma.education.create({
    data: {
      candidateId: candidateProfile.id,
      school: data.school,
      degree: data.degree,
      startDate: data.startDate,
      endDate: data.endDate ?? null,
    },
  });

  return education;
};
export const updateCandidateEducationService = async (
  userId: string,
  educationId: string,
  data: AddCandidateEducationInput,
) => {
  const candidateProfile = await prisma.candidateProfile.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!candidateProfile) {
    throw new AppError("Candidate profile not found", 404);
  }

  const education = await prisma.education.findFirst({
    where: {
      id: educationId,
      candidateId: candidateProfile.id,
    },
  });

  if (!education) {
    throw new AppError("Education not found", 404);
  }

  const updatedEducation = await prisma.education.update({
    where: {
      id: educationId,
    },
    data: {
      school: data.school,
      degree: data.degree,
      startDate: data.startDate,
      endDate: data.endDate ?? null,
    },
  });

  return updatedEducation;
};

export const deleteCandidateEducationService = async (
  userId: string,
  educationId: string,
) => {
  const candidateProfile = await prisma.candidateProfile.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!candidateProfile) {
    throw new AppError("Candidate profile not found", 404);
  }

  const education = await prisma.education.findFirst({
    where: {
      id: educationId,
      candidateId: candidateProfile.id,
    },
  });

  if (!education) {
    throw new AppError("Education not found", 404);
  }

  await prisma.education.delete({
    where: {
      id: educationId,
    },
  });

  return education;
};
export const addCandidateExperienceService = async (
  userId: string,
  data: AddCandidateExperienceInput,
) => {
  const candidateProfile = await prisma.candidateProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!candidateProfile) {
    throw new AppError("Candidate profile not found", 404);
  }

  const experience = await prisma.experience.create({
    data: {
      candidateId: candidateProfile.id,
      title: data.title,
      company: data.company,
      startDate: data.startDate,
      endDate: data.endDate ?? null,
      description: data.description ?? null,
      order: data.order ?? 0,
    },
  });

  return experience;
};
export const updateCandidateExperienceService = async (
  userId: string,
  experienceId: string,
  data: AddCandidateExperienceInput,
) => {
  const candidateProfile = await prisma.candidateProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!candidateProfile) {
    throw new AppError("Candidate profile not found", 404);
  }

  const experience = await prisma.experience.findFirst({
    where: {
      id: experienceId,
      candidateId: candidateProfile.id,
    },
  });

  if (!experience) {
    throw new AppError("Experience not found", 404);
  }

  return prisma.experience.update({
    where: { id: experienceId },
    data: {
      title: data.title,
      company: data.company,
      startDate: data.startDate,
      endDate: data.endDate ?? null,
      description: data.description ?? null,
      order: data.order ?? 0,
    },
  });
};
export const deleteCandidateExperienceService = async (
  userId: string,
  experienceId: string,
) => {
  const candidateProfile = await prisma.candidateProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!candidateProfile) {
    throw new AppError("Candidate profile not found", 404);
  }

  const experience = await prisma.experience.findFirst({
    where: {
      id: experienceId,
      candidateId: candidateProfile.id,
    },
  });

  if (!experience) {
    throw new AppError("Experience not found", 404);
  }

  await prisma.experience.delete({
    where: { id: experienceId },
  });

  return { message: "Experience deleted successfully" };
};
export const getUserInformationService = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: userResponseSelect,
  });

  if (!user) {
    throw new AppError("User not found", 400);
  }

  return toUserResponse(user);
};
