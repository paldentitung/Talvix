import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import toast from "react-hot-toast";

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,

    onSuccess: async (data) => {
      const user = data.data;

      queryClient.setQueryData(["me"], data);

      toast.success("Login successful!");

      switch (user.role) {
        case "ADMIN":
          navigate("/admin/dashboard", { replace: true });
          break;

        case "RECRUITER":
          navigate("/recruiter/dashboard", { replace: true });
          break;

        case "CANDIDATE":
          navigate("/candidate/dashboard", { replace: true });
          break;

        default:
          navigate("/", { replace: true });
      }
    },

    onError: (error: Error) => {
      toast.error(error.message || "Login failed");
    },
  });
}
