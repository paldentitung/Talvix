import type { User } from "../../users/types/user.types";
import type { UserRole } from "../../../shared/types/user.types";

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
