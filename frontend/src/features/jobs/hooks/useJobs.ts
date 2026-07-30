import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../api/jobApi";

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });
}
