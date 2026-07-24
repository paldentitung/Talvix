import bcrypt from "bcrypt";
import prisma from "../../lib/prisma.js";
import {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
} from "./auth.types.js";
import AppError from "../../utils/AppError.js";
import sendEmail from "../../utils/sendEmail.js";
import crypto from "crypto";
export const registerService = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
  });

  const { password, ...safeUser } = user;

  return safeUser;
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
