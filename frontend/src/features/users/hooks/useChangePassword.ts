import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { changePassword } from "../api/usersApi";
import type { ChangePasswordRequest } from "../types/user.types";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),

    onSuccess: () => {
      toast.success("Password changed successfully.");
    },

    onError: (error) => {
      toast.error(error.message || "Failed to change password.");
    },
  });
};
