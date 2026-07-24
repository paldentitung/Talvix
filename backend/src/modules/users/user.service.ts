import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import bcrypt from "bcrypt";
import { ChangePasswordInput } from "./user.type.js";
export const getMeService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isVerified: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
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
