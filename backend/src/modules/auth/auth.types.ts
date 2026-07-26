import { Role } from "@prisma/client";

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}
export interface VerifyEmailInput {
  token: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
export interface ForgotPasswordInput {
  email: string;
}
export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}
