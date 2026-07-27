import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../api/authApi";
import toast from "react-hot-toast";
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,

    onSuccess: () => {
      toast.success("Email send successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
