// shared/constants/roleLabels.ts
import type { UserRole } from "../types/user.types";

export const ROLE_LABELS: Record<UserRole, string> = {
  CANDIDATE: "Candidate",
  RECRUITER: "Recruiter",
  ADMIN: "Admin",
};
