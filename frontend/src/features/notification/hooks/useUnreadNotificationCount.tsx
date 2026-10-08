import { useQuery } from "@tanstack/react-query";

import { getUnreadNotificationCount } from "../api/notificationApi";

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadNotificationCount,
    select: (res) => res.data.count,
  });
};
