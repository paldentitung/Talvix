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
