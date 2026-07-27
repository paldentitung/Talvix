import { useMutation } from "@tanstack/react-query";
import { verifyEmail } from "../api/authApi";
import toast from "react-hot-toast";

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),

    onSuccess: () => {
      toast.success("Email verified successfully!");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "This verification link is invalid or has expired.",
      );
    },
  });
}
