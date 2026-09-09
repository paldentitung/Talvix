import request from "../../../shared/services/api";

export const getCompanies = (page: number, limit: number, query?: string) => {
  return request(
    `/companies?page=${page}&limit=${limit}&query=${query}`,
    {},
    true,
  );
};
