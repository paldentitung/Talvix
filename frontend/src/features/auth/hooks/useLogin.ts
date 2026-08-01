import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import toast from "react-hot-toast";

export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      toast.success("Login successful!");

      const role = data.data.role;

      switch (role) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;

        case "RECRUITER":
          navigate("/recruiter/dashboard");
          break;

        case "CANDIDATE":
          navigate("/candidate/dashboard");
          break;

        default:
          navigate("/");
      }
    },

    onError: (error: Error) => {
      toast.error(error.message || "Login failed");
    },
  });
}
