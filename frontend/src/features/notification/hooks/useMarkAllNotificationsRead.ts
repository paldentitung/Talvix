import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markAllNotificationsAsRead } from "../api/notificationApi";

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
};
