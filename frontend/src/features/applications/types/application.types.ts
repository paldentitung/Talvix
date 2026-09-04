export type ApplyJobData = {
  jobId: string;
  coverLetter: string;
  resume: File;
};
export type Applicant = {
  id: string;
  initials: string;
  name: string;
  jobTitle: string;
  status: ApplicationStatus;
  appliedAt: string;
  about: string;
  currentCompany: string;
  location: string;
  skills: string[];
  resumeUrl: string | null;
  coverLetter: string | null;
  email: string;
};
export type ApplicationStatus =
  | "PENDING"
  | "REVIEWING"
  | "SHORTLISTED"
  | "REJECTED"
  | "ACCEPTED";

export type RawApplication = {
  id: string;
  userId: string;
  jobId: string;
  coverLetter: string | null;
  resumeUrl: string | null;
  status: ApplicationStatus;
  recruiterNotes: string | null;
  appliedAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar: string | null;
    phone: string | null;
    bio: string | null;
    location: string | null;
    title: string | null;
  };
  job: {
    id: string;
    title: string;
    location: string;
    skills: string[];
  };
};
