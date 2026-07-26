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
