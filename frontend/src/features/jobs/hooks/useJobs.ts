import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../api/jobApi";

export function useJobs(
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  filters?: any,
) {
  return useQuery({
    queryKey: ["jobs", page, pageSize, search, filters],
    queryFn: () => getJobs(page, pageSize, search, filters),
    select: (data) => data?.data ?? [],
  });
}
