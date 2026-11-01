import { useQuery } from "@tanstack/react-query";
import { getApplicationById } from "../api/applicationApi";
export const useApplication = (id: string | null) =>
  useQuery({
    queryKey: ["application", id],
    queryFn: () => getApplicationById(id!),
    enabled: !!id,
    select: (res) => res.data,
  });
