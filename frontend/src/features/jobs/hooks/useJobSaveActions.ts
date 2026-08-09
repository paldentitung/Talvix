import { useMemo } from "react";
import { useSavedJobs } from "./useSavedJobs";
import { useToggleSaveJob } from "./useToggleSaveJob";

export function useJobSaveActions() {
  const { data: savedJobs = [] } = useSavedJobs();
  const toggleSaveJobMutation = useToggleSaveJob();

  const savedJobIds = useMemo(
    () => new Set(savedJobs.map((job) => job.id)),
    [savedJobs],
  );

  const isJobSaved = (jobId: string) => savedJobIds.has(jobId);

  const isSavingJob = (jobId: string) =>
    toggleSaveJobMutation.isPending &&
    toggleSaveJobMutation.variables === jobId;

  const toggleSave = (jobId: string) => {
    toggleSaveJobMutation.mutate(jobId);
  };

  return { isJobSaved, isSavingJob, toggleSave };
}
