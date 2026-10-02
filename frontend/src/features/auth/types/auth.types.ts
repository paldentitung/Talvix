import type { UserRole } from "../../../shared/types/user.types";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "CANDIDATE" | "RECRUITER";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
