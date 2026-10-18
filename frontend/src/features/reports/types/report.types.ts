export type ReportReason =
  | "SCAM"
  | "MISLEADING_INFORMATION"
  | "INAPPROPRIATE_CONTENT"
  | "SPAM"
  | "OTHER";

export type ReportStatus = "PENDING" | "RESOLVED" | "DISMISSED";

type ReportUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type Report = {
  id: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  createdAt: string;
  reviewedAt: string | null;
  reporter: ReportUser;
  job: { id: string; title: string } | null;
  reportedUser: ReportUser | null;
};
export type UpdateReportStatusInput = {
  reportId: string;
  status: "RESOLVED" | "DISMISSED" | "PENDING";
};
export type CreateReportPayload = {
  reason: string;
  description: string;
  jobId?: string;
  reportedUserId?: string;
};
