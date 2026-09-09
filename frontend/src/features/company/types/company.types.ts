// features/companies/types/company.types.ts

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

export interface CompanyDetailResponse {
  success: boolean;
  message: string;
  data: CompanyDetail;
}
