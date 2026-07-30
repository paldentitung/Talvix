import request from "../../../shared/services/api";

export const getJobs = async () => {
  return await request("/jobs", {}, true);
};
