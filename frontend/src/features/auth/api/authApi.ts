import request from "../../../shared/services/api";
import type { RegisterRequest, LoginRequest } from "../types/auth.type";

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
    false,
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
