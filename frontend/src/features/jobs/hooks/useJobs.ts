import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../api/jobApi";

export function useJobs(
  page: number = 1,
  pageSize: number = 10,
  search?: string,
) {
  return useQuery({
    queryKey: ["jobs", page, pageSize, search],
    queryFn: () => getJobs(page, pageSize, search),
    select: (data) => data?.data ?? [],
  });
}
