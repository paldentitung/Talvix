import { useMutation } from "@tanstack/react-query";
import { updateCandidateEducation } from "../api/usersApi";
import type { AddCandidateEducationInput } from "../types/user.type";
import { queryClient } from "../../../shared/lib/queryClient";

export const useUpdateEducation = () => {
  return useMutation({
    mutationFn: ({
      educationId,
      data,
    }: {
      educationId: string;
      data: AddCandidateEducationInput;
    }) => updateCandidateEducation(educationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
    },
  });
};
