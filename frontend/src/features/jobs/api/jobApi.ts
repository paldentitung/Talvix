import request from "../../../shared/services/api";
import type { JobFormValues } from "../types/job.types";

export const getJobs = async () => {
  return await request("/jobs", {}, false);
};

export const createJob = async (
  jobData: Omit<JobFormValues, "deadline"> & { deadline: string | null },
) => {
  return await request(
    "/jobs",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    },
    true,
  );
};
