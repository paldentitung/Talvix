import { useQuery } from "@tanstack/react-query";
import { getCandidateDashboard } from "../api/dashboardApi";

export const useCandidateDashboard = () => {
  return useQuery({
    queryKey: ["candidateDashboard"],
    queryFn: getCandidateDashboard,
    select: (res) => res.data,
  });
};
