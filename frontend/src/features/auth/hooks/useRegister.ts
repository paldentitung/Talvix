import { useMutation } from "@tanstack/react-query";
import { register } from "../api/authApi";
import toast from "react-hot-toast";

export function useRegister() {
  return useMutation({
    mutationFn: register,

    onSuccess: () => {
      toast.success("Registered!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
