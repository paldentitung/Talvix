import request from "../../../shared/services/api";

export const getUsers = (page: number, limit: number) => {
  return request(`/users/all?page=${page}&limit=${limit}`, {}, true);
};
