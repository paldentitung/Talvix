import { useQuery } from "@tanstack/react-query";
import { getJobApplications } from "../api/applicationApi";

export const useJobApplications = (jobId: string | undefined) => {
  return useQuery({
    queryKey: ["application", jobId],
    queryFn: () => getJobApplications(jobId!),
    enabled: !!jobId,
    select: (res) => res.data,
  });
};
