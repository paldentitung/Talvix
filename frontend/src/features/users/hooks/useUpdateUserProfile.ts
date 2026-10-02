import { useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "../api/usersApi";
import type { UpdateUserRequest } from "../types/user.types";
import { queryClient } from "../../../shared/lib/queryClient";

export const useUserUpdateProfile = () => {
  return useMutation({
    mutationFn: (data: UpdateUserRequest) => updateUserProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
