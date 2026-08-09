import { useMutation } from "@tanstack/react-query";
import { logout } from "../api/authApi";
import { useAuth } from "../contexts/AuthContext";

export const useLogout = () => {
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      setUser(null);
    },
  });
};
