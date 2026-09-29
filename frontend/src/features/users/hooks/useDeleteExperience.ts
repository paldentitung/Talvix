import { useMutation } from "@tanstack/react-query";
import { deleteCandidateExperience } from "../api/usersApi";
import { queryClient } from "../../../shared/lib/queryClient";

export const useDeleteExperience = () => {
  return useMutation({
    mutationFn: (experienceId: string) =>
      deleteCandidateExperience(experienceId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  });
};
