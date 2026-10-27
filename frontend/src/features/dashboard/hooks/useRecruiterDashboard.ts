import { useQuery } from "@tanstack/react-query";
import { getRecruiterDashboard } from "../api/dashboardApi";

export const useRecruiterDashboard = () => {
  return useQuery({
    queryKey: ["recruiterDashboard"],
    queryFn: getRecruiterDashboard,
    select: (res) => res.data,
  });
};
