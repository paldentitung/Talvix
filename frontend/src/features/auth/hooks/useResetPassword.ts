import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../api/authApi";
import toast from "react-hot-toast";
export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,

    onSuccess: () => {
      toast.success("Password reset successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
