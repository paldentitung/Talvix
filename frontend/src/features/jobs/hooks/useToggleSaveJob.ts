import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { saveJob } from "../api/jobApi";

export const useToggleSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => saveJob(jobId),

    onSuccess: () => {
      toast.success("Job saved successfully");

      queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
      queryClient.invalidateQueries({ queryKey: ["job"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["recruiterJobs"] });
    },

    onError: () => {
      toast.error("Failed to update saved job");
    },
  });
};
