import request from "../../../shared/services/api";
import type { Job, JobFormValues } from "../types/job.types";

export const getJobs = async () => {
  return await request("/jobs", {});
};

export const getRecruiterJobs = async () => {
  return await request("/jobs/me", {}, true);
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

export const getJobById = async (jobId: string): Promise<Job> => {
  const res = await request(`/jobs/${jobId}`, {}, true);
  return res.data as Job;
};

export const deleteJob = async (jobId: string) => {
  return await request(
    `/jobs/${jobId}`,
    {
      method: "DELETE",
    },
    true,
  );
};

export const updateJob = async ({
  jobId,
  jobData,
}: {
  jobId: string;
  jobData: Omit<JobFormValues, "deadline"> & { deadline: string | null };
}): Promise<Job> => {
  const res = await request(
    `/jobs/${jobId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    },
    true,
  );

  return res.data as Job;
};
