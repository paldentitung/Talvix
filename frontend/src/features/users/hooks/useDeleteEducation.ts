import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../shared/lib/queryClient";
import { deleteCandidateEducation } from "../api/usersApi";
export const useDeleteEducation = () => {
  return useMutation({
    mutationFn: (educationId: string) => deleteCandidateEducation(educationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
    },
  });
};
