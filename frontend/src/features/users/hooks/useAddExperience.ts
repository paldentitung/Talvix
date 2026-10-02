import { useMutation } from "@tanstack/react-query";
import { addCandidateExperience } from "../api/usersApi";
import type { AddCandidateExperienceInput } from "../types/user.types";
import { queryClient } from "../../../shared/lib/queryClient";

export const useAddExperience = () => {
  return useMutation({
    mutationFn: (data: AddCandidateExperienceInput) =>
      addCandidateExperience(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
    },
  });
};
