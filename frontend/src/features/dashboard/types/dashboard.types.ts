import type { User } from "../../users/types/user.types";
import type { UserRole } from "../../../shared/types/user.types";
import type { JobStatus } from "../../jobs/types/job.types";
import type { ApplicationStatus } from "../../applications/types/application.types";

export type DashboardOverview = {
  totalUsers: number;
  totalCompanies: number;
  activeJobs: number;
  pendingReports: number;
  unverifiedRecruiters: number;
};

export type RoleCount = {
  role: UserRole;
  count: number;
};

// One point per day for the last 30 days (date is "YYYY-MM-DD")
export type GrowthPoint = {
  date: string;
  total: number;
};

export type ReportType = "JOB" | "USER";

export type PendingReportItem = {
  id: string;
  reason: string;
  createdAt: string;
  type: ReportType;
};

// The shape of the full /admin/dashboard response
export type AdminDashboard = {
  overview: DashboardOverview;
  usersByRole: RoleCount[];
  growth: GrowthPoint[];
  newUsers: User[];
  pendingReportsList: PendingReportItem[];
};

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP";

export type PipelineStage =
  | "PENDING"
  | "REVIEWING"
  | "SHORTLISTED"
  | "ACCEPTED";

export type RecruiterOverview = {
  activeJobs: number;
  jobsClosingSoon: number;
  totalApplicants: number;
  newApplicantsThisWeek: number;
  awaitingReview: number;
  hiredThisMonth: number;
};

// One point per day for the last 30 days (date is "YYYY-MM-DD")
export type TrendPoint = { date: string; count: number };

export type PipelineItem = { stage: PipelineStage; count: number };

export type DashboardJob = {
  id: string;
  title: string;
  location: string;
  employmentType: EmploymentType;
  status: JobStatus;
  applicantsCount: number;
  newApplicantsCount: number;
};

export type NeedsReviewItem = {
  id: string;
  appliedAt: string; // ISO string
  jobId: string;
  jobTitle: string;
  candidateName: string;
};

// The shape of `data` inside the /recruiter/dashboard response
export type RecruiterDashboard = {
  overview: RecruiterOverview;
  trend: TrendPoint[];
  pipeline: PipelineItem[];
  jobs: DashboardJob[];
  needsReview: NeedsReviewItem[];
};

export type CandidateOverview = {
  totalApplications: number;
  appliedThisWeek: number;
  savedJobs: number;
  savedClosingSoon: number;
  inReview: number; // PENDING + REVIEWING
  shortlisted: number;
  accepted: number;
};

export type CandidateRecentApplication = {
  id: string;
  status: ApplicationStatus;
  appliedAt: string; // ISO string
  jobId: string;
  jobTitle: string;
  companyName: string | null;
};

export type CandidateUpdate = {
  id: string;
  title: string;
  message: string;
  entityId: string | null;
  entityType: string | null;
  createdAt: string; // ISO string
};

// The shape of `data` inside the /candidate/dashboard response
export type CandidateDashboard = {
  overview: CandidateOverview;
  statusCounts: Record<ApplicationStatus, number>;
  recentApplications: CandidateRecentApplication[];
  updates: CandidateUpdate[];
  unreadUpdates: number;
};
