export const USER_ROLE = {
  CANDIDATE: "CANDIDATE",
  RECRUITER: "RECRUITER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
