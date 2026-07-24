export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "CANDIDATE" | "RECRUITER" | "ADMIN";
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
export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
