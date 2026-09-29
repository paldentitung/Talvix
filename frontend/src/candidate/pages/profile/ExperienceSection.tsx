import toast from "react-hot-toast";
import { useAddExperience } from "../../../features/users/hooks/useAddExperience";
import { useUpdateExperience } from "../../../features/users/hooks/useUpdateExperience";
import { useDeleteExperience } from "../../../features/users/hooks/useDeleteExperience";
import type {
  AddCandidateExperienceInput,
  CandidateExperience,
} from "../../../features/users/types/user.type";
import EntryList from "./EntryList";
import type { Entry } from "./shared";

// API -> UI
export const toExperienceEntry = (e: CandidateExperience): Entry => ({
  id: e.id,
  title: e.title,
  org: e.company,
  start: e.startDate.slice(0, 7),
  end: e.endDate ? e.endDate.slice(0, 7) : null,
  description: e.description ?? "",
});

// UI -> API
const toExperienceInput = (e: Entry): AddCandidateExperienceInput => ({
  title: e.title.trim(),
  company: e.org.trim(),
  startDate: `${e.start}-01`,
  endDate: e.end ? `${e.end}-01` : null,
  description: e.description?.trim() || null,
});

export default function ExperienceSection({
  experience,
}: {
  experience: CandidateExperience[];
}) {
  const addExperience = useAddExperience();
  const updateExperience = useUpdateExperience();
  const deleteExperience = useDeleteExperience();

  const busy =
    addExperience.isPending ||
    updateExperience.isPending ||
    deleteExperience.isPending;

  const save = async (entry: Entry) => {
    try {
      if (entry.id) {
        await updateExperience.mutateAsync({
          experienceId: entry.id,
          data: toExperienceInput(entry),
        });
      } else {
        await addExperience.mutateAsync(toExperienceInput(entry));
      }
      toast.success(entry.id ? "Experience updated" : "Experience added");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save experience",
      );
      throw err; // keeps the modal open
    }
  };

  const remove = async (entry: Entry) => {
    try {
      await deleteExperience.mutateAsync(entry.id);
      toast.success("Experience deleted");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete experience",
      );
    }
  };

  return (
    <EntryList
      heading="Experience"
      titleLabel="Job title"
      orgLabel="Company"
      currentLabel="I currently work here"
      withDescription
      entries={experience.map(toExperienceEntry)}
      onSave={save}
      onDelete={remove}
      busy={busy}
    />
  );
}
