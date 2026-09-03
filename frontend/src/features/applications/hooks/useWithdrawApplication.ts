import { useMutation } from "@tanstack/react-query";
import { withdrawApplication } from "../api/applicationApi";
import { queryClient } from "../../../shared/lib/queryClient";
import toast from "react-hot-toast";

export const useWithdrawApplication = () => {
  return useMutation({
    mutationFn: (applicationId: string) => withdrawApplication(applicationId),

    onSuccess: () => {
      toast.success("Application withdrawn successfully");
      queryClient.invalidateQueries({
        queryKey: ["myApplications"],
      });
    },

    onError: () => {
      toast.error("Failed to withdraw application");
    },
  });
};
