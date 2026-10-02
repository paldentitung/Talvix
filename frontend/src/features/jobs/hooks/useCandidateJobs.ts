import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { JobFilters } from "../types/job.types";
import { getCandidateJobs } from "../api/jobApi";
export const useCandidateJobs = (
  page: number,
  pageSize: number,
  search?: string,
  filters?: JobFilters,
) =>
  useQuery({
    queryKey: ["jobs", "candidate", page, pageSize, search, filters],
    queryFn: () => getCandidateJobs(page, pageSize, search, filters),
    placeholderData: keepPreviousData,
    select: (response) => response.data,
  });
