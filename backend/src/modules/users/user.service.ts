import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import bcrypt from "bcrypt";
import { ChangePasswordInput, UpdateProfileBody } from "./user.type.js";
import { toUserResponse } from "./user.mapper.js";
import { userResponseSelect } from "./user.select.js";
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

export const updateProfileService = async (
  userId: string,
  data: UpdateProfileBody,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("user not found", 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
  });

  return toUserResponse(updatedUser);
};
