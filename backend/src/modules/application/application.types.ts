import { ApplicationStatus } from "@prisma/client";

export interface ApplicationResponse {
  id: string;

  userId: string;
  jobId: string;

  coverLetter: string | null;
  resumeUrl: string | null;

  status: ApplicationStatus;
  recruiterNotes: string | null;

  appliedAt: Date;
  updatedAt: Date;
}

export interface CreateApplicationInput {
  jobId: string;
  coverLetter?: string;
  resumeUrl?: string;
}
