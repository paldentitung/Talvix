import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../api/jobApi";
import type { Job, JobFilters } from "../types/job.types";

interface JobsApiEnvelope {
  success: boolean;
  message: string;
  data: {
    jobs: Job[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export function useJobs(
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  filters?: JobFilters,
) {
  return useQuery({
    queryKey: ["jobs", page, pageSize, search, filters],
    queryFn: () => getJobs(page, pageSize, search, filters),
    // API returns { success, message, data: { jobs, total, page, totalPages } }.
    // Unwrap down to just the { jobs, total, page, totalPages } payload —
    // that's the only part any consumer of this hook needs.
    select: (response: JobsApiEnvelope) => response.data,
  });
}
