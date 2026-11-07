import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createJob } from "../api/jobApi";

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["recruiterJobs"],
      });

      toast.success("Job saved as draft. Publish it when you're ready.");
    },

    onError: () => {
      toast.error("Failed to create job. Please try again.");
    },
  });
};
