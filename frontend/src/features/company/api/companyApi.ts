import request from "../../../shared/services/api";
import type { ApiResponse } from "../../../shared/types/api.types";
import type { CompanyDetailRaw } from "../types/company.types";
export const getCompanies = (page: number, limit: number, query?: string) => {
  return request(
    `/companies?page=${page}&limit=${limit}&query=${query}`,
    {},
    true,
  );
};
export const getCompanyById = (
  id: string,
): Promise<ApiResponse<CompanyDetailRaw>> => {
  return request(`/companies/${id}`, {}, true);
};
