import { useQuery } from "@tanstack/react-query";
import { getRecruiterJobs } from "../api/jobApi";

export function useRecruiterJobs() {
  return useQuery({
    queryKey: ["recruiterJobs"],
    queryFn: getRecruiterJobs,
    select: (data) => data?.data ?? [],
  });
}
