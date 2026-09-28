import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { updateAvatar } from "../api/usersApi";
import { queryClient } from "../../../shared/lib/queryClient";

export const useUpdateAvatar = () => {
  return useMutation({
    mutationFn: (avatar: File) => updateAvatar(avatar),

    onSuccess: () => {
      toast.success("Avatar updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update avatar");
    },
  });
};
