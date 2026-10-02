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
  experiences?: CandidateExperience[];

  companyName: string | null;
  companyLogo: string | null;
  companyWebsite: string | null;
  companyDescription: string | null;
  companyLocation: string | null;
  companyTagline: string | null;
  companyIndustry: string | null;
  companySize: string | null;

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

// POST /candidate/education
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
  startDate: string;
  endDate: string | null;
}

// POST /candidate/experience
export interface AddCandidateExperienceInput {
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  order?: number;
}

export interface CandidateExperience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  order: number;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyName: string | null;
  isVerified: boolean;
  createdAt: string;
}
