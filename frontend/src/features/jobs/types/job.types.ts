export interface Job {
  id: string;

  title: string;
  description: string;

  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;

  location: string;

  workMode: "ONSITE" | "REMOTE" | "HYBRID";

  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";

  experienceLevel: "ENTRY" | "MID" | "SENIOR" | "LEAD";

  skills: string[];

  openings: number | null;

  deadline: string | null;

  featured: boolean;

  status: "DRAFT" | "OPEN" | "CLOSED";

  recruiterId: string;

  recruiter: {
    id: string;
    firstName: string;
    lastName: string;

    companyName: string | null;
    companyLogo: string | null;
  };

  createdAt: string;
  updatedAt: string;
}

export type JobFormValues = {
  title: string;
  description: string;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  skills: string[];
  deadline: string;
  openings: number | null;
  featured: boolean;
};

export type WorkMode = "REMOTE" | "ONSITE" | "HYBRID";
export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP";
export type ExperienceLevel = "ENTRY" | "MID" | "SENIOR" | "LEAD";
