import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserStatus } from "../api/usersApi";
import type { AccountStatus } from "../types/user.types";

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: AccountStatus;
    }) => updateUserStatus(userId, status),

    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["company", userId] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
};
