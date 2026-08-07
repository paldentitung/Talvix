import { useQuery } from "@tanstack/react-query";
import { getSavedJobs } from "../api/jobApi";

export const useSavedJobs = () => {
  return useQuery({
    queryKey: ["savedJobs"],
    queryFn: getSavedJobs,
  });
};
