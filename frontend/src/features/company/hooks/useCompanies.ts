import { useQuery } from "@tanstack/react-query";
import { getCompanies } from "../api/companyApi";
export const useCompanies = (page: number, limit: number, query: string) => {
  return useQuery({
    queryKey: ["companies", page, limit, query],
    queryFn: () => getCompanies(page, limit, query),
  });
};
