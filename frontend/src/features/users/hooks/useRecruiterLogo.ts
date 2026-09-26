import { useMutation } from "@tanstack/react-query";
import { updateRecruiterLogo } from "../api/usersApi";

export const useRecruiterLogo = () => {
  return useMutation({
    mutationFn: (file: File) => updateRecruiterLogo(file),
  });
};
