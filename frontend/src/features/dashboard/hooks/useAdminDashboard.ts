import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "../api/dashboardApi";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getAdminDashboard,
    select: (res) => res.data,
  });
};
