import { useMutation } from "@tanstack/react-query";
import { addCandidateEducation } from "../api/usersApi";
import type { AddCandidateEducationInput } from "../types/user.type";
import { queryClient } from "../../../shared/lib/queryClient";
export const useAddEducation = () => {
  return useMutation({
    mutationFn: (data: AddCandidateEducationInput) =>
      addCandidateEducation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  });
};
