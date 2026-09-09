import { useQuery } from "@tanstack/react-query";
import type { JobFilters } from "../types/job.types";
import { getAdminJobs } from "../api/jobApi";

export const useAdminJobs = (
  page: number,
  limit: number,
  search?: string,
  filters?: JobFilters,
) => {
  return useQuery({
    queryKey: ["adminJobs", page, limit, search, filters],
    queryFn: () => getAdminJobs(page, limit, search, filters),
  });
};
