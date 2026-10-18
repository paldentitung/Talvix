import { useQuery } from "@tanstack/react-query";
import { getReportStats } from "../api/reportApi";

export const useReportStats = () => {
  return useQuery({
    queryKey: ["report-stats"],
    queryFn: getReportStats,
    select: (res) => res.data,
  });
};
