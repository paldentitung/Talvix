import request from "../../../shared/services/api";
import type { ReportStatus, CreateReportPayload } from "../types/report.types";

export const getReports = (page = 1, limit = 10, status?: ReportStatus) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) params.set("status", status);

  return request(`/reports?${params.toString()}`, {}, true);
};

export const getReportById = (reportId: string) => {
  return request(`/reports/${reportId}`, {}, true);
};

export const getReportStats = () => {
  return request("/reports/stats", {}, true);
};

export const createReport = (payload: CreateReportPayload) => {
  return request(
    "/reports",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    true,
  );
};

export const updateReportStatus = (
  reportId: string,
  status: "RESOLVED" | "DISMISSED" | "PENDING",
) => {
  return request(
    `/reports/${reportId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    },
    true,
  );
};
