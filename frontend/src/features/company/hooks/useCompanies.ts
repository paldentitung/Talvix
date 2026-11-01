import { useQuery } from "@tanstack/react-query";
import { getCompanies } from "../api/companyApi";
export const useCompanies = (
  page: number = 1,
  limit: number = 12,
  search?: string,
  isVerified?: boolean,
) => {
  return useQuery({
    queryKey: ["companies", page, limit, search, isVerified],
    queryFn: () => getCompanies({ page, limit, search, isVerified }),
  });
};
