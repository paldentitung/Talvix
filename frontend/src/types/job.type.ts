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
