import { useQuery } from "@tanstack/react-query";

import { getRecruiterJobs } from "../api/jobApi";

export function useRecruiterJobs(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["recruiterJobs", page, limit],

    queryFn: () => getRecruiterJobs(page, limit),

    select: (res) => res.data,
  });
}
