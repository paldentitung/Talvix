import request from "../../../shared/services/api";
import type {
  RegisterRequest,
  LoginRequest,
  ResetPasswordRequest,
} from "../types/auth.type";

export const register = async (data: RegisterRequest) => {
  return request(
    "/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
    false,
  );
};
export const login = async (data: LoginRequest) => {
  return request(
    "/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
    true,
  );
};
export const verifyEmail = async (token: string) => {
  return request(
    `/auth/verify-email/${token}`,
    {
      method: "GET",
    },
    false,
  );
};
export const forgotPassword = async (email: string) => {
  return request(
    "/auth/forgot-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    },
    false,
  );
};
export const resetPassword = async (data: ResetPasswordRequest) => {
  return request(
    "/auth/reset-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
    false,
  );
};

export const getMe = async () => {
  return request("/auth/me", {}, true);
};

export const logout = async () => {
  return request("/auth/logout", { method: "POST" }, true);
};

export const loginWithGoogle = (role?: "CANDIDATE" | "RECRUITER") => {
  const base = `${import.meta.env.VITE_API_BACKEND_URL}/api/auth/google`;
  const url = role ? `${base}?role=${role}` : base;
  window.location.href = url;
};
