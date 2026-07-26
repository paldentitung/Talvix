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
