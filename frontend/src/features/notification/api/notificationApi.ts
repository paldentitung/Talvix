import request from "../../../shared/services/api";

export const getNotifications = async () => {
  return request("/notifications", {}, true);
};
export const getUnreadNotificationCount = async () => {
  return request("/notifications/unread-count", {}, true);
};

export const markNotificationAsRead = (notificationId: string) => {
  return request(
    `/notifications/${notificationId}/read`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
    },
    true,
  );
};
export const markAllNotificationsAsRead = () => {
  return request(
    "/notifications/read-all",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
    },
    true,
  );
};
