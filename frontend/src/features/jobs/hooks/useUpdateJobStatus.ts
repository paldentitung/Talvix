import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJobStatus } from "../api/jobApi";
import { toast } from "react-hot-toast";
export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJobStatus,
    onSuccess: (_, variables) => {
      toast.success("Job status updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["recruiterJobs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["job", variables.jobId],
      });

      queryClient.invalidateQueries({
        queryKey: ["adminJobs"],
      });
    },
  });
};
