import request from "../../../shared/services/api";
import type { ApplyJobData } from "../types/application.types";

export const applyJob = (applicationData: ApplyJobData) => {
  const formData = new FormData();

  formData.append("jobId", applicationData.jobId);
  formData.append("coverLetter", applicationData.coverLetter);
  formData.append("resume", applicationData.resume);

  return request(
    "/applications",
    {
      method: "POST",
      body: formData,
    },
    true,
  );
};

export const getJobApplications = async (
  jobId: string,
  page = 1,
  limit = 10,
) => {
  return await request(
    `/applications/job/${jobId}?page=${page}&limit=${limit}`,
    {},
    true,
  );
};
export const getMyApplications = async (page = 1, limit = 10) => {
  return await request(
    `/applications/me?page=${page}&limit=${limit}`,
    {},
    true,
  );
};
export const withdrawApplication = async (applicationId: string) => {
  return await request(
    `/applications/${applicationId}/withdraw`,
    {
      method: "DELETE",
    },
    true,
  );
};
export const updateApplicationStatus = async (
  applicationId: string,
  status:
    | "PENDING"
    | "REVIEWING"
    | "SHORTLISTED"
    | "REJECTED"
    | "ACCEPTED"
    | "WITHDRAWN",
) => {
  return await request(
    `/applications/${applicationId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    },
    true,
  );
};
