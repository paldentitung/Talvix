import { useQuery } from "@tanstack/react-query";
import { getJobApplications } from "../api/applicationApi";

export const useJobApplications = (
  jobId: string | undefined,
  page = 1,
  limit = 10,
) => {
  return useQuery({
    queryKey: ["jobApplications", jobId, page, limit],
    queryFn: () => getJobApplications(jobId!, page, limit),
    enabled: !!jobId,
    select: (res) => res.data,
  });
};
