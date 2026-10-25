import { useQuery } from "@tanstack/react-query";
import { getRecruiterJobs } from "../api/jobApi";

export function useRecruiterJobs(
  page = 1,
  limit = 10,
  search = "",
  status?: string,
) {
  return useQuery({
    queryKey: ["recruiterJobs", page, limit, search, status],
    queryFn: () => getRecruiterJobs(page, limit, search, status),
    select: (res) => res.data,
  });
}
