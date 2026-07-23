export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "CANDIDATE" | "RECRUITER" | "ADMIN";
}

export interface LoginInput {
  email: string;
  password: string;
}
