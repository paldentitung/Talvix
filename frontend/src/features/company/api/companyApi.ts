import request from "../../../shared/services/api";
import type { ApiResponse } from "../../../shared/types/api.types";
import type { CompanyDetailRaw } from "../types/company.types";
export const getCompanies = (options: {
  page: number;
  limit: number;
  search?: string;
  isVerified?: boolean;
}) => {
  const { page, limit, search, isVerified } = options;

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search: search ?? "",
  });

  if (isVerified !== undefined) {
    params.set("isVerified", String(isVerified));
  }

  return request(`/companies?${params.toString()}`, {}, true);
};

export const getCompanyById = (
  id: string,
): Promise<ApiResponse<CompanyDetailRaw>> => {
  return request(`/companies/${id}`, {}, true);
};
