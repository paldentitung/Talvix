import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { applyJob } from "../api/applicationApi";

export const useApplyJob = () => {
  return useMutation({
    mutationFn: applyJob,

    onSuccess: () => {
      toast.success("Application submitted successfully!");
    },

    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit application",
      );
    },
  });
};
