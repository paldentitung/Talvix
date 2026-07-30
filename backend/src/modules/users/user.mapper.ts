import { UserResponsePayload } from "./user.select.js";

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;

  role: UserResponsePayload["role"];

  avatar: string | null;
  phone: string | null;
  bio: string | null;
  location: string | null;
  title: string | null;
  resumeUrl: string | null;

  // Recruiter fields
  companyName: string | null;
  companyLogo: string | null;
  companyWebsite: string | null;
  companyDescription: string | null;

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
  bio: user.bio,
  location: user.location,
  title: user.title,
  resumeUrl: user.resumeUrl,

  companyName: user.companyName,
  companyLogo: user.companyLogo,
  companyWebsite: user.companyWebsite,
  companyDescription: user.companyDescription,

  isVerified: user.isVerified,

  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
