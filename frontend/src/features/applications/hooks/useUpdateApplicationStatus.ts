import { useMutation } from "@tanstack/react-query";
import type { ApplicationStatus } from "../types/application.types";
import { updateApplicationStatus } from "../api/applicationApi";
import { queryClient } from "../../../shared/lib/queryClient";
export const useUpdateApplicationStatus = () => {
  return useMutation({
    mutationFn: async ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: ApplicationStatus;
    }) => {
      return await updateApplicationStatus(applicationId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
    },
  });
};
