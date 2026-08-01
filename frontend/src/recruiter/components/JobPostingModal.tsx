import { useState } from "react";
import { X } from "lucide-react";
import Modal from "../../components/ui/Modal";

type WorkMode = "REMOTE" | "ONSITE" | "HYBRID";
type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
type ExperienceLevel = "ENTRY" | "MID" | "SENIOR" | "LEAD";

export type JobFormValues = {
  title: string;
  description: string;
  salaryMin: string;
  salaryMax: string;
  currency: string;
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  skills: string[];
  deadline: string;
  openings: string;
  featured: boolean;
};

const emptyForm: JobFormValues = {
  title: "",
  description: "",
  salaryMin: "",
  salaryMax: "",
  currency: "NPR",
  location: "",
  workMode: "REMOTE",
  employmentType: "FULL_TIME",
  experienceLevel: "MID",
  skills: [],
  deadline: "",
  openings: "1",
  featured: false,
};

const workModeOptions: WorkMode[] = ["REMOTE", "ONSITE", "HYBRID"];
const employmentOptions: EmploymentType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
];
const experienceOptions: ExperienceLevel[] = ["ENTRY", "MID", "SENIOR", "LEAD"];
const currencyOptions = ["NPR", "USD", "INR"];

const labelize = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

type PostJobModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: JobFormValues) => void;
};

const PostJobModal = ({ isOpen, onClose, onSubmit }: PostJobModalProps) => {
  const [form, setForm] = useState<JobFormValues>(emptyForm);
  const [skillInput, setSkillInput] = useState("");

  const update = <K extends keyof JobFormValues>(
    key: K,
    value: JobFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value || form.skills.includes(value)) {
      setSkillInput("");
      return;
    }
    update("skills", [...form.skills, value]);
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    update(
      "skills",
      form.skills.filter((s) => s !== skill),
    );
  };

  const handleClose = () => {
    setForm(emptyForm);
    setSkillInput("");
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(form);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Post a job"
      description="Fill in the details candidates will see."
      maxWidth="max-w-2xl"
      footer={
        <>
          <button
            onClick={handleClose}
            className="rounded-(--radius-md) border border-(--border) bg-(--card) px-4 py-2 text-sm font-semibold text-(--text-secondary) hover:bg-(--bg)"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.title || !form.location}
            className="rounded-(--radius-md) bg-(--primary) px-4 py-2 text-sm font-semibold text-white hover:bg-(--primary-dark) disabled:cursor-not-allowed disabled:opacity-50"
          >
            Post job
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-(--text-primary)">Job title</span>
          <input
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Senior Product Designer"
            className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-(--text-primary)">Description</span>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            placeholder="Role responsibilities, requirements, and what makes this role interesting"
            className="resize-none rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
          />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-(--text-primary)">Location</span>
            <input
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="e.g. Remote, or San Francisco, CA"
              className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-(--text-primary)">Work mode</span>
            <select
              value={form.workMode}
              onChange={(e) => update("workMode", e.target.value as WorkMode)}
              className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
            >
              {workModeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {labelize(opt)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-(--text-primary)">
              Employment type
            </span>
            <select
              value={form.employmentType}
              onChange={(e) =>
                update("employmentType", e.target.value as EmploymentType)
              }
              className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
            >
              {employmentOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {labelize(opt)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-(--text-primary)">
              Experience level
            </span>
            <select
              value={form.experienceLevel}
              onChange={(e) =>
                update("experienceLevel", e.target.value as ExperienceLevel)
              }
              className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
            >
              {experienceOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {labelize(opt)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-(--text-primary)">
              Salary min
            </span>
            <input
              type="number"
              value={form.salaryMin}
              onChange={(e) => update("salaryMin", e.target.value)}
              placeholder="Optional"
              className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-(--text-primary)">
              Salary max
            </span>
            <input
              type="number"
              value={form.salaryMax}
              onChange={(e) => update("salaryMax", e.target.value)}
              placeholder="Optional"
              className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-(--text-primary)">Currency</span>
            <select
              value={form.currency}
              onChange={(e) => update("currency", e.target.value)}
              className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
            >
              {currencyOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-(--text-primary)">Openings</span>
            <input
              type="number"
              min={1}
              value={form.openings}
              onChange={(e) => update("openings", e.target.value)}
              className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-(--text-primary)">
              Application deadline
            </span>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => update("deadline", e.target.value)}
              className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-(--text-primary)">Skills</span>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Type a skill and press Enter"
              className="flex-1 rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
            />
            <button
              type="button"
              onClick={addSkill}
              className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm font-semibold text-(--text-secondary) hover:bg-(--bg)"
            >
              Add
            </button>
          </div>
          {form.skills.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-2">
              {form.skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1.5 rounded-full bg-(--primary-light) px-3 py-1 text-xs font-medium text-(--primary)"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    aria-label={`Remove ${skill}`}
                    className="hover:text-(--primary-dark)"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="h-4 w-4 rounded border-(--border) text-(--primary) focus:ring-(--primary)"
          />
          <span className="text-(--text-primary)">Feature this job</span>
        </label>
      </div>
    </Modal>
  );
};

export default PostJobModal;
