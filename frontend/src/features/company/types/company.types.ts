// features/companies/types/company.types.ts

import type { AccountStatus } from "../../users/types/user.types";

export interface CompanyJobSummary {
  id: string;
  title: string;
  location: string;
  workMode: "ONSITE" | "REMOTE" | "HYBRID";
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  experienceLevel: "ENTRY" | "MID" | "SENIOR" | "LEAD";
  createdAt: string;
}

export interface CompanyListItem {
  id: string;
  firstName: string;
  lastName: string;
  status: AccountStatus;
  companyName: string | null;
  companyLogo: string | null;
  companyWebsite: string | null;
  companyDescription: string | null;
  location: string | null;
  isVerified: boolean;
  createdAt: string;
  _count: {
    jobs: number;
  };
}

export interface CompanyDetail extends Omit<CompanyListItem, "_count"> {
  jobs: CompanyJobSummary[];
}

export interface CompaniesListResponse {
  success: boolean;
  message: string;
  data: {
    companies: CompanyListItem[];
    total: number;
    page: number;
    totalPages: number;
  };
}
export interface RecruiterProfile {
  companyName: string | null;
  companyLogo: string | null;
  companyWebsite: string | null;
  companyDescription: string | null;
  companyLocation: string | null;
  companyTagline: string | null;
}
// raw shape returned by GET /companies/:id
export interface CompanyDetailRaw {
  id: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  createdAt: string;
  recruiterProfile: RecruiterProfile | null;
  jobs: CompanyJobSummary[];
  _count: { jobs: number };
  status: AccountStatus;
  avatar: string | null;
}

// what the UI uses (flat)
export interface CompanyDetail {
  id: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  createdAt: string;
  companyName: string | null;
  companyLogo: string | null;
  companyWebsite: string | null;
  companyDescription: string | null;
  location: string | null;
  jobs: CompanyJobSummary[];
  status: AccountStatus;
  tagline: string | null;
  avatar: string | null;
}
