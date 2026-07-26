import request from "../../../shared/services/api";
import type { RegisterRequest } from "../types/auth.type";

export const register = async (data: RegisterRequest) => {
  return request("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};
