import request from "../../../shared/services/api";
import type {
  Job,
  JobFilters,
  JobFormValues,
  UpdateJobStatusPayload,
} from "../types/job.types";

export const getJobs = async (
  page = 1,
  pageSize = 10,
  search?: string,
  filters?: JobFilters,
) => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());

  if (search) {
    params.append("search", search);
  }

  if (filters?.location) {
    params.append("location", filters.location);
  }
  if (filters?.workMode) {
    params.append("workMode", filters.workMode);
  }
  if (filters?.employmentType) {
    params.append("employmentType", filters.employmentType);
  }
  if (filters?.experienceLevel) {
    params.append("experienceLevel", filters.experienceLevel);
  }
  if (filters?.skills?.length) {
    params.append("skills", filters.skills.join(","));
  }
  if (filters?.minSalary !== undefined) {
    params.append("minSalary", filters.minSalary.toString());
  }
  if (filters?.maxSalary !== undefined) {
    params.append("maxSalary", filters.maxSalary.toString());
  }
  if (filters?.currency) {
    params.append("currency", filters.currency);
  }

  return await request(`/jobs?${params.toString()}`, {});
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

export const updateJobStatus = async ({
  jobId,
  status,
}: UpdateJobStatusPayload): Promise<Job> => {
  const res = await request(
    `/jobs/${jobId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    },
    true,
  );

  return res.data as Job;
};

export const saveJob = async (jobId: string) => {
  return await request(
    `/jobs/${jobId}/save-toggle`,
    {
      method: "POST",
    },
    true,
  );
};
export const getSavedJobs = async (): Promise<Job[]> => {
  const res = await request("/jobs/saved", {}, true);
  const savedJobs = res.data ?? [];
  return savedJobs.map((saved: { job: Job }) => saved.job);
};
