import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/usersApi";

export const useUsers = (
  page: number,
  limit: number,
  search: string = "",
  role: string = "",
) => {
  return useQuery({
    queryKey: ["users", page, limit, search, role],
    queryFn: () => getUsers(page, limit, search, role),
  });
};
