export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
export interface UpdateUserBody {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export interface UpdateCandidateProfileBody {
  bio?: string;
  location?: string;
  title?: string;
  resumeUrl?: string;
}

export interface UpdateRecruiterProfileBody {
  companyName?: string;
  companyLogo?: string;
  companyWebsite?: string;
  companyDescription?: string;
}
