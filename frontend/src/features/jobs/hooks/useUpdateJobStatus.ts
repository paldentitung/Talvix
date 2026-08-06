import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJobStatus } from "../api/jobApi";

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJobStatus,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["recruiterJobs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["job", variables.jobId],
      });
    },
  });
};
