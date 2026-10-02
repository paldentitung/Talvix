import { useMutation } from "@tanstack/react-query";
import { updateCandidateExperience } from "../api/usersApi";
import type { AddCandidateExperienceInput } from "../types/user.types";
import { queryClient } from "../../../shared/lib/queryClient";

export const useUpdateExperience = () => {
  return useMutation({
    mutationFn: ({
      experienceId,
      data,
    }: {
      experienceId: string;
      data: AddCandidateExperienceInput;
    }) => updateCandidateExperience(experienceId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
    },
  });
};
