import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getJobApplications } from "../api/applicationApi";
import type { ApplicationStatus } from "../types/application.types";

export function useJobApplications(
  jobId?: string,
  page = 1,
  limit = 10,
  search = "",
  status?: ApplicationStatus,
) {
  return useQuery({
    queryKey: ["jobApplications", jobId, page, limit, search, status],

    queryFn: () => getJobApplications(jobId!, page, limit, search, status),

    enabled: !!jobId,

    select: (res) => ({
      applications: res?.data?.applications ?? [],
      total: res?.data?.pagination?.total ?? 0,
      totalPages: res?.data?.pagination?.totalPages ?? 1,
    }),

    placeholderData: keepPreviousData,
  });
}
