import bcrypt from "bcrypt";
import prisma from "../../lib/prisma.js";
import {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "./auth.types.js";
import AppError from "../../utils/AppError.js";
import sendEmail from "../../utils/sendEmail.js";
import crypto from "crypto";
import { userResponseSelect } from "../users/user.select.js";
import { toUserResponse } from "../users/user.mapper.js";
export const registerService = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60);

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      verificationToken: verificationToken,
      verificationExpires: verificationTokenExpires,
    },
  });

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  const emailSent = await sendEmail({
    to: user.email,
    subject: "Verify your email",
    html: `
  <h2>Verify your email</h2>
  <a href="${verificationUrl}">Verify Email</a>
`,
  });

  if (!emailSent) {
    await prisma.user.delete({
      where: { id: user.id },
    });

    throw new AppError("Failed to send verification email", 500);
  }

  const { password, ...safeUser } = user;

  return safeUser;
};
export const verifyEmailService = async (data: VerifyEmailInput) => {
  const user = await prisma.user.findFirst({
    where: {
      verificationToken: data.token,
      verificationExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new AppError("Invalid or expired verification token", 400);
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationExpires: null,
    },
  });
  return {
    success: true,
    message: "Email verified successfully",
  };
};

export const loginService = async (data: LoginInput) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!existingUser) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    existingUser.password,
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const { password, ...safeUser } = existingUser;

  return safeUser;
};
export const forgotPasswordService = async (data: ForgotPasswordInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    },
  });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const emailSent = await sendEmail({
    to: user.email,
    subject: "Reset Your Password",
    html: `
      <h2>Reset Your Password</h2>
      <p>Click the button below to reset your password.</p>
      <a href="${resetUrl}">Reset Password</a>
    `,
  });

  if (!emailSent) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    throw new AppError("Failed to send reset email", 500);
  }

  return {
    success: true,
    message: "Reset email sent successfully",
  };
};
export const resetPasswordService = async (data: ResetPasswordInput) => {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: data.token,
      resetPasswordExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) throw new AppError("Invalid or expired reset token", 400);

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  return {
    success: true,
    message: "Password reset successfully",
  };
};

export const getMeService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userResponseSelect,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return toUserResponse(user);
};
