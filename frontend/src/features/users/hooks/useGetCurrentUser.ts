import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/usersApi";

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getUser,
    select: (response) => response.data,
  });
};
