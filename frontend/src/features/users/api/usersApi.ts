import request from "../../../shared/services/api";
import type {
  UpdateUserRequest,
  UpdateCandidateProfileRequest,
  UpdateRecruiterProfileRequest,
  ChangePasswordRequest,
  AddCandidateEducationInput,
} from "../types/user.type";

export const getUsers = (page: number, limit: number) => {
  return request(`/users/all?page=${page}&limit=${limit}`, {}, true);
};

export const updateUserProfile = (data: UpdateUserRequest) => {
  return request("/users/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const updateCandidateProfile = (data: UpdateCandidateProfileRequest) => {
  return request("/users/profile/candidate", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const updateRecruiterProfile = (data: UpdateRecruiterProfileRequest) => {
  return request("/users/profile/recruiter", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const changePassword = (data: ChangePasswordRequest) => {
  return request("/users/change-password", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const updateRecruiterLogo = (file: File) => {
  const formData = new FormData();

  formData.append("logo", file);

  return request("/users/profile/recruiter/logo", {
    method: "PATCH",
    body: formData,
  });
};

export const updateAvatar = (file: File) => {
  const formData = new FormData();

  formData.append("avatar", file);

  return request(
    "/users/profile/avatar",
    {
      method: "PATCH",
      body: formData,
    },
    true,
  );
};

export const removeAvatar = async () => {
  return request("/users/profile/avatar", { method: "DELETE" }, true);
};

export const uploadResume = async (file: File) => {
  const formData = new FormData();

  formData.append("resume", file);

  return request(
    "/users/resume",
    {
      method: "PATCH",
      body: formData,
    },
    true,
  );
};

export const removeResume = async () => {
  return request(
    "/users/resume",
    {
      method: "DELETE",
    },
    true,
  );
};
export const addCandidateEducation = async (
  data: AddCandidateEducationInput,
) => {
  return request(
    "/users/candidate/education",
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    },
    true,
  );
};

export const updateCandidateEducation = async (
  educationId: string,
  data: AddCandidateEducationInput,
) => {
  return request(
    `/users/candidate/education/${educationId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    },
    true,
  );
};

export const deleteCandidateEducation = async (educationId: string) => {
  return request(
    `/users/candidate/education/${educationId}`,
    {
      method: "DELETE",
    },
    true,
  );
};
