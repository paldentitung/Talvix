import { useMutation } from "@tanstack/react-query";
import { updateReportStatus } from "../api/reportApi";
import { queryClient } from "../../../shared/lib/queryClient";
import type { UpdateReportStatusInput } from "../types/report.types";

export const useUpdateReportStatus = () => {
  return useMutation({
    mutationFn: ({ reportId, status }: UpdateReportStatusInput) =>
      updateReportStatus(reportId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });
    },
  });
};
