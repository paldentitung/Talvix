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
} from "./user.validation.js";
export const getMeService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: userResponseSelect,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return toUserResponse(user);
};

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
