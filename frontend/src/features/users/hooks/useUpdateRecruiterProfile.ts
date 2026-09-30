import { useMutation } from "@tanstack/react-query";
import { updateRecruiterProfile } from "../api/usersApi";
import type { UpdateRecruiterProfileRequest } from "../types/user.type";
import { queryClient } from "../../../shared/lib/queryClient";

export const useUpdateRecruiterProfile = () => {
  return useMutation({
    mutationFn: (data: UpdateRecruiterProfileRequest) =>
      updateRecruiterProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
