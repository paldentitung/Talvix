import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeAvatar } from "../api/usersApi";
import toast from "react-hot-toast";

export const useRemoveAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeAvatar,
    onSuccess: () => {
      toast.success("Avatar removed");
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
    },
  });
};
