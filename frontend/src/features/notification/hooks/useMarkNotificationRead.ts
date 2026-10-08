import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markNotificationAsRead } from "../api/notificationApi";

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
};
