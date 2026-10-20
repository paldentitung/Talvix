import type { Notification } from "../types/notification.types";
import type { UserRole } from "../../../shared/types/user.types";

const NOTIFICATION_ROUTES: Record<
  UserRole,
  Record<string, (n: Notification) => string | null>
> = {
  CANDIDATE: {
    // entityId = application id
    APPLICATION_STATUS_CHANGED: () => `/candidate/applications`,
  },
  RECRUITER: {
    // entityId = job id
    APPLICATION_SUBMITTED: (n) =>
      n.entityId ? `/recruiter/applicants/${n.entityId}` : null,
  },
  ADMIN: {
    // add admin types as you create them
  },
};
export const getNotificationLink = (
  role: UserRole | undefined,
  n: Notification,
): string | null => {
  if (!role || !n.type) return null;
  const resolver = NOTIFICATION_ROUTES[role]?.[n.type];
  return resolver ? resolver(n) : null;
};
