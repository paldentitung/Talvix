import request from "../../../shared/services/api";
import type { ApiResponse } from "../../../shared/types/api.types";
import type {
  ApplicationDetail,
  ApplicationStatus,
  ApplyJobData,
} from "../types/application.types";

export const applyJob = (applicationData: ApplyJobData) => {
  const formData = new FormData();

  formData.append("jobId", applicationData.jobId);
  formData.append("coverLetter", applicationData.coverLetter);

  if (applicationData.useProfileResume) {
    formData.append("useProfileResume", "true");
  } else if (applicationData.resume) {
    formData.append("resume", applicationData.resume);
  }

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
  search = "",
  status?: ApplicationStatus,
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (status) {
    params.set("status", status);
  }

  return request(`/applications/job/${jobId}?${params.toString()}`, {}, true);
};

export const getRecruiterApplications = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  jobId?: string;
  status?: ApplicationStatus;
}) => {
  const { page = 1, limit = 10, search, jobId, status } = params;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search?.trim()) query.set("search", search.trim());
  if (jobId) query.set("jobId", jobId);
  if (status) query.set("status", status);

  return request(`/applications/recruiter?${query.toString()}`, {}, true);
};

export const getMyApplications = async (page = 1, limit = 10) => {
  return await request(
    `/applications/me?page=${page}&limit=${limit}`,
    {},
    true,
  );
};

export const getApplicationById = async (
  id: string,
): Promise<ApiResponse<ApplicationDetail>> => {
  return request(`/applications/${id}`, {}, true);
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
