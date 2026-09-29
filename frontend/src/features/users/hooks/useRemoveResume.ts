import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeResume } from "../api/usersApi";

export const useRemoveResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeResume,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  });
};
