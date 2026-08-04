// features/jobs/hooks/useJob.ts
import { useQuery } from "@tanstack/react-query";
import type { Job } from "../types/job.types";
import { getJobById } from "../api/jobApi";

export const useJob = (jobId: string | undefined) => {
  return useQuery<Job>({
    queryKey: ["job", jobId],
    queryFn: () => getJobById(jobId as string),
    enabled: !!jobId,
  });
};
