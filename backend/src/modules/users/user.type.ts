export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
export interface UpdateProfileBody {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  location?: string;
  title?: string;
}
