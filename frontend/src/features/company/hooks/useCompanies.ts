import { useQuery } from "@tanstack/react-query";
import { getCompanies } from "../api/companyApi";
export const useCompanies = (
  page: number = 1,
  pageSize: number = 12,
  search?: string,
) => {
  return useQuery({
    queryKey: ["companies", page, pageSize, search],
    queryFn: () => getCompanies(page, pageSize, search),
  });
};
