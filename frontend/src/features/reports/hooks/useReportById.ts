import { useQuery } from "@tanstack/react-query";
import { getReportById } from "../api/reportApi";

export const useReportById = (reportId: string | undefined) => {
  return useQuery({
    queryKey: ["reports", reportId],
    queryFn: () => getReportById(reportId!),
    enabled: !!reportId,
    select: (res) => res.data,
  });
};
