import { useMutation } from "@tanstack/react-query";
import { updateCandidateProfile } from "../api/usersApi";
import type { UpdateCandidateProfileRequest } from "../types/user.type";
import { queryClient } from "../../../shared/lib/queryClient";

export const useUpdateCandidateProfile = () => {
  return useMutation({
    mutationFn: (data: UpdateCandidateProfileRequest) =>
      updateCandidateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
