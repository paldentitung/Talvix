import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadResume } from "../api/usersApi";

export const useUploadResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resume: File) => uploadResume(resume),

    onSuccess: (response) => {
      queryClient.setQueryData(["currentUser"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            resumeUrl: response.data.resumeUrl,
          },
        };
      });
    },
  });
};
