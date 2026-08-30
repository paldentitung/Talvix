import { useMutation } from "@tanstack/react-query";
import { applyJob } from "../api/applicationApi";

export const useApplyJob = () => {
  return useMutation({
    mutationFn: applyJob,
  });
};
