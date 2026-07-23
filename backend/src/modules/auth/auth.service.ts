import bcrypt from "bcrypt";
import prisma from "../../lib/prisma.js";
import { LoginInput, RegisterInput } from "./auth.types.js";
import AppError from "../../utils/AppError.js";
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
