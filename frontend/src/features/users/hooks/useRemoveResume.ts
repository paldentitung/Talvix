import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeResume } from "../api/usersApi";

export const useRemoveResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeResume,

    onSuccess: () => {
      queryClient.setQueryData(["me"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            resumeUrl: null,
          },
        };
      });
    },
  });
};
