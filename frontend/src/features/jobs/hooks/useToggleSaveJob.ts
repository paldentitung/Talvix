import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveJob } from "../api/jobApi";

export const useToggleSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => saveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
      queryClient.invalidateQueries({ queryKey: ["job"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["recruiterJobs"] });
    },
  });
};
