import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type {
  ApplicationStatus,
  RecruiterApplicationsResponse,
} from "../types/application.types";
import { getRecruiterApplications } from "../api/applicationApi";

export const useRecruiterApplications = (params: {
  page: number;
  limit: number;
  search: string;
  jobId?: string;
  status?: ApplicationStatus;
}) =>
  useQuery<RecruiterApplicationsResponse>({
    queryKey: [
      "recruiterApplications",
      params.page,
      params.limit,
      params.search,
      params.jobId,
      params.status,
    ],
    queryFn: () => getRecruiterApplications(params),
    placeholderData: keepPreviousData,
  });
