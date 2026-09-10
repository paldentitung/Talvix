import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/authApi";
export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    select: (res) => res.data,
    retry: false,
  });
};
