import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../api/notificationApi";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    select: (res) => res.data,
  });
};
