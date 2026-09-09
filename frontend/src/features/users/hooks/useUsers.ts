import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/usersApi";

export const useUsers = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => getUsers(page, limit),
  });
};
