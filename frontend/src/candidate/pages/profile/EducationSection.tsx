import toast from "react-hot-toast";
import { useAddEducation } from "../../../features/users/hooks/useAddEducation";
import { useUpdateEducation } from "../../../features/users/hooks/useUpdateEducation";
import { useDeleteEducation } from "../../../features/users/hooks/useDeleteEducation";
import type {
  AddCandidateEducationInput,
  CandidateEducation,
} from "../../../features/users/types/user.type";
import EntryList from "./EntryList";
import type { Entry } from "./shared";

// API -> UI
export const toEducationEntry = (e: CandidateEducation): Entry => ({
  id: e.id,
  title: e.degree,
  org: e.school,
  start: e.startDate.slice(0, 7),
  end: e.endDate ? e.endDate.slice(0, 7) : null,
});

// UI -> API
const toEducationInput = (e: Entry): AddCandidateEducationInput => ({
  school: e.org.trim(),
  degree: e.title.trim(),
  startDate: `${e.start}-01`,
  endDate: e.end ? `${e.end}-01` : null,
});

export default function EducationSection({
  education,
}: {
  education: CandidateEducation[];
}) {
  const addEducation = useAddEducation();
  const updateEducation = useUpdateEducation();
  const deleteEducation = useDeleteEducation();

  const busy =
    addEducation.isPending ||
    updateEducation.isPending ||
    deleteEducation.isPending;

  const save = async (entry: Entry) => {
    try {
      if (entry.id) {
        await updateEducation.mutateAsync({
          educationId: entry.id,
          data: toEducationInput(entry),
        });
      } else {
        await addEducation.mutateAsync(toEducationInput(entry));
      }
      toast.success(entry.id ? "Education updated" : "Education added");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save education",
      );
      throw err; // keeps the modal open
    }
  };

  const remove = async (entry: Entry) => {
    try {
      await deleteEducation.mutateAsync(entry.id);
      toast.success("Education deleted");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete education",
      );
    }
  };

  return (
    <EntryList
      heading="Education"
      titleLabel="Degree"
      orgLabel="School"
      currentLabel="I currently study here"
      entries={education.map(toEducationEntry)}
      onSave={save}
      onDelete={remove}
      busy={busy}
    />
  );
}
