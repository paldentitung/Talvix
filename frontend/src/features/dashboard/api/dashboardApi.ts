import request from "../../../shared/services/api";
import type {
  AdminDashboard,
  RecruiterDashboard,
} from "../types/dashboard.types";
import type { ApiResponse } from "../../../shared/types/api.types";

export const getAdminDashboard = () => {
  return request("/dashboard/admin", {}, true) as Promise<
    ApiResponse<AdminDashboard>
  >;
};
export const getRecruiterDashboard = () => {
  return request("/dashboard/recruiter", {}, true) as Promise<
    ApiResponse<RecruiterDashboard>
  >;
};
