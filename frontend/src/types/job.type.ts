export interface Job {
  id: string;
  title: string;
  company: string;
  companyInitial: string;
  companyColor: string;
  location: string;
  employmentType: string;
  workMode?: string;
  level?: string;
  salaryRange: string;
  postedAt: string;
  isActivelyHiring?: boolean;
}
