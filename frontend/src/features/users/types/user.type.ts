import type { UserRole } from "../../../shared/types/user.types";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar: string | null;
  phone: string | null;
  bio: string | null;
  location: string | null;
  title: string | null;
  resumeUrl: string | null;
  skills: string[];
  educations?: CandidateEducation[];
  companyName: string | null;
  companyLogo: string | null;
  companyWebsite: string | null;
  companyDescription: string | null;
  companyLocation: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// PATCH /profile
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

// PATCH /profile/candidate
export interface UpdateCandidateProfileRequest {
  bio?: string;
  location?: string;
  title?: string;
  resumeUrl?: string;
  skills?: string[];
}

// PATCH /profile/recruiter
export interface UpdateRecruiterProfileRequest {
  companyName?: string;
  companyLogo?: string;
  companyWebsite?: string;
  companyDescription?: string;
  companyLocation: string | null;
  companyTagline?: string;
  companyIndustry?: string;
  companySize?: string;
}

// PATCH /change-password
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
export interface AddCandidateEducationInput {
  school: string;
  degree: string;
  startDate: string;
  endDate: string | null;
}
export interface CandidateEducation {
  id: string;
  school: string;
  degree: string;
  startDate: string; // ISO, e.g. "2024-05-01T00:00:00.000Z"
  endDate: string | null;
}
