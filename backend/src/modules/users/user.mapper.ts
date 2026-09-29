import { UserResponsePayload } from "./user.select.js";

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserResponsePayload["role"];
  avatar: string | null;
  phone: string | null;

  // Candidate fields
  bio: string | null;
  location: string | null;
  title: string | null;
  resumeUrl: string | null;
  skills: string[];

  educations: {
    id: string;
    school: string;
    degree: string;
    startDate: Date;
    endDate: Date | null;
  }[];

  experiences: {
    id: string;
    title: string;
    company: string;
    startDate: Date;
    endDate: Date | null;
    description: string | null;
    order: number;
  }[];

  // Recruiter fields
  companyName: string | null;
  companyLogo: string | null;
  companyWebsite: string | null;
  companyDescription: string | null;
  companyLocation: string | null;
  companyTagline: string | null;
  companyIndustry: string | null;
  companySize: string | null;

  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export const toUserResponse = (user: UserResponsePayload): UserResponse => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  avatar: user.avatar,
  phone: user.phone,

  bio: user.candidateProfile?.bio ?? null,
  location: user.candidateProfile?.location ?? null,
  title: user.candidateProfile?.title ?? null,
  resumeUrl: user.candidateProfile?.resumeUrl ?? null,
  skills: user.candidateProfile?.skills ?? [],

  educations: user.candidateProfile?.educations ?? [],
  experiences: user.candidateProfile?.experiences ?? [],

  companyName: user.recruiterProfile?.companyName ?? null,
  companyLogo: user.recruiterProfile?.companyLogo ?? null,
  companyWebsite: user.recruiterProfile?.companyWebsite ?? null,
  companyDescription: user.recruiterProfile?.companyDescription ?? null,
  companyLocation: user.recruiterProfile?.companyLocation ?? null,
  companyTagline: user.recruiterProfile?.companyTagline ?? null,
  companyIndustry: user.recruiterProfile?.companyIndustry ?? null,
  companySize: user.recruiterProfile?.companySize ?? null,

  isVerified: user.isVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
