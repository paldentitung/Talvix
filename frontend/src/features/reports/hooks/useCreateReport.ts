import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReport } from "../api/reportApi";
import type { CreateReportPayload } from "../types/report.types";

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReportPayload) => createReport(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["report-stats"] });
    },
  });
};
