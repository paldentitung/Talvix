import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJob } from "../api/jobApi";

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJob,
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
