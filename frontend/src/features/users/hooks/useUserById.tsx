import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../api/usersApi";

export const useUserById = (id: string | null) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id!),
    enabled: !!id,
    select: (res) => res.data,
  });
