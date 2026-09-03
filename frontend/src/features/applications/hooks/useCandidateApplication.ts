import { useQuery } from "@tanstack/react-query";
import { getMyApplications } from "../api/applicationApi";

export const useCandidateApplication = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["myApplications"],
    queryFn: () => getMyApplications(page, limit),
  });
};
