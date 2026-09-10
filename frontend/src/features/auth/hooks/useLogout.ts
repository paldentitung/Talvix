import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/authApi";
import toast from "react-hot-toast";
import { queryClient } from "../../../shared/lib/queryClient";
export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
      queryClient.removeQueries({ queryKey: ["me"] });
      navigate("/login");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to log out");
    },
  });
};
