import { useMutation } from "@tanstack/react-query";
import { login } from "../api/authApi";
import toast from "react-hot-toast";

export function useLogin() {
  return useMutation({
    mutationFn: login,

    onSuccess: () => {
      toast.success("Logged in successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
