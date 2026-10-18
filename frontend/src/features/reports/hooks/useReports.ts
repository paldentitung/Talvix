import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getReports } from "../api/reportApi";
import type { ReportStatus } from "../types/report.types";
export const useReports = (
  page: number,
  limit: number,
  status?: ReportStatus,
) => {
  return useQuery({
    queryKey: ["reports", page, limit, status ?? "ALL"],
    queryFn: () => getReports(page, limit, status),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
  });
};
