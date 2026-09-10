import request from "../../../shared/services/api";
import type {
  UpdateUserRequest,
  UpdateCandidateProfileRequest,
  UpdateRecruiterProfileRequest,
  ChangePasswordRequest,
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
