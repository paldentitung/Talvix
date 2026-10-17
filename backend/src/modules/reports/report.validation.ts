import { ReportReason } from "@prisma/client";

export type CreateReportInput = {
  reason: ReportReason;
  description?: string;
  jobId?: string;
  reportedUserId?: string;
};
