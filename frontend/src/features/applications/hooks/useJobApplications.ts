import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getJobApplications } from "../api/applicationApi";

export function useJobApplications(jobId?: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: ["jobApplications", jobId, page, limit],

    queryFn: () => getJobApplications(jobId!, page, limit),

    enabled: !!jobId,

    select: (res) => ({
      applications: res?.data?.applications ?? [],
      total: res?.data?.pagination?.total ?? 0,
      totalPages: res?.data?.pagination?.totalPages ?? 1,
    }),

    placeholderData: keepPreviousData,
  });
}
