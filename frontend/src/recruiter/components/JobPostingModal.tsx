import { useState } from "react";
import { X } from "lucide-react";
import Modal from "../../components/ui/Modal";
import type {
  JobFormValues,
  WorkMode,
  EmploymentType,
  ExperienceLevel,
} from "../../features/jobs/types/job.types";

const emptyForm: JobFormValues = {
  title: "",
  description: "",
  salaryMin: null,
  salaryMax: null,
  currency: "NPR",
  location: "",
  workMode: "REMOTE",
  employmentType: "FULL_TIME",
  experienceLevel: "MID",
  skills: [],
  deadline: "",
  openings: null,
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

type FormErrors = Partial<Record<keyof JobFormValues, string>>;

const validate = (form: JobFormValues): FormErrors => {
  const errors: FormErrors = {};

  if (!form.title.trim()) {
    errors.title = "Title is required.";
  } else if (form.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters.";
  } else if (form.title.trim().length > 100) {
    errors.title = "Title must be under 100 characters.";
  }

  if (!form.description.trim()) {
    errors.description = "Description is required.";
  } else if (form.description.trim().length < 20) {
    errors.description = `Description must be at least 20 characters (${form.description.trim().length}/20).`;
  }

  if (!form.location.trim()) {
    errors.location = "Location is required.";
  } else if (form.location.trim().length < 2) {
    errors.location = "Location must be at least 2 characters.";
  }

  if (form.skills.length === 0) {
    errors.skills = "Add at least one skill.";
  }

  if (form.salaryMin !== null && form.salaryMin <= 0) {
    errors.salaryMin = "Salary min must be greater than 0.";
  }

  if (form.salaryMax !== null && form.salaryMax <= 0) {
    errors.salaryMax = "Salary max must be greater than 0.";
  }

  if (
    form.salaryMin !== null &&
    form.salaryMax !== null &&
    form.salaryMin > form.salaryMax
  ) {
    errors.salaryMax =
      "Salary max must be greater than or equal to salary min.";
  }

  if (form.openings !== null && form.openings <= 0) {
    errors.openings = "Openings must be at least 1.";
  }

  if (form.deadline) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(form.deadline);
    if (deadlineDate < today) {
      errors.deadline = "Deadline can't be in the past.";
    }
  }

  return errors;
};

type PostJobModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: JobFormValues) => void | Promise<void>;
};

const PostJobModal = ({ isOpen, onClose, onSubmit }: PostJobModalProps) => {
  const [form, setForm] = useState<JobFormValues>(emptyForm);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof JobFormValues, boolean>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = <K extends keyof JobFormValues>(
    key: K,
    value: JobFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const markTouched = (key: keyof JobFormValues) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) {
      setSkillInput("");
      return;
    }
    if (form.skills.includes(value)) {
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
    setErrors({});
    setTouched({});
    setSubmitError(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async () => {
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setSubmitError(null);

    if (Object.keys(validationErrors).length > 0) {
      // mark every field touched so all relevant errors show up
      setTouched({
        title: true,
        description: true,
        location: true,
        skills: true,
        salaryMin: true,
        salaryMax: true,
        openings: true,
        deadline: true,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(form);
      handleClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong while posting this job. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldError = (key: keyof JobFormValues) =>
    touched[key] ? errors[key] : undefined;

  const inputClass = (hasError: boolean) =>
    `rounded-(--radius-md) border px-3 py-2 text-sm text-(--text-primary) outline-none bg-(--card) ${
      hasError
        ? "border-red-500 focus:border-red-500"
        : "border-(--border) focus:border-(--primary)"
    }`;

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
            disabled={isSubmitting}
            className="rounded-(--radius-md) border border-(--border) bg-(--card) px-4 py-2 text-sm font-semibold text-(--text-secondary) hover:bg-(--bg) disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-(--radius-md) bg-(--primary) px-4 py-2 text-sm font-semibold text-white hover:bg-(--primary-dark) disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Posting…" : "Post job"}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {submitError && (
          <div className="rounded-(--radius-md) border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-600">
            {submitError}
          </div>
        )}

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-(--text-primary)">Job title</span>
          <input
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            onBlur={() => markTouched("title")}
            placeholder="e.g. Senior Product Designer"
            className={inputClass(!!fieldError("title"))}
          />
          {fieldError("title") && (
            <span className="text-xs text-red-500">{fieldError("title")}</span>
          )}
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-(--text-primary)">Description</span>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            onBlur={() => markTouched("description")}
            rows={4}
            placeholder="Role responsibilities, requirements, and what makes this role interesting"
            className={`resize-none ${inputClass(!!fieldError("description"))}`}
          />
          <div className="flex items-center justify-between">
            {fieldError("description") ? (
              <span className="text-xs text-red-500">
                {fieldError("description")}
              </span>
            ) : (
              <span />
            )}
            <span className="text-xs text-(--text-secondary)">
              {form.description.trim().length}/20 min
            </span>
          </div>
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-(--text-primary)">Location</span>
            <input
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              onBlur={() => markTouched("location")}
              placeholder="e.g. Remote, or San Francisco, CA"
              className={inputClass(!!fieldError("location"))}
            />
            {fieldError("location") && (
              <span className="text-xs text-red-500">
                {fieldError("location")}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-(--text-primary)">Work mode</span>
            <select
              value={form.workMode}
              onChange={(e) => update("workMode", e.target.value as WorkMode)}
              className={inputClass(false)}
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
              className={inputClass(false)}
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
              className={inputClass(false)}
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
              min={1}
              value={form.salaryMin ?? ""}
              onChange={(e) =>
                update(
                  "salaryMin",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              onBlur={() => markTouched("salaryMin")}
              placeholder="Optional"
              className={inputClass(!!fieldError("salaryMin"))}
            />
            {fieldError("salaryMin") && (
              <span className="text-xs text-red-500">
                {fieldError("salaryMin")}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-(--text-primary)">
              Salary max
            </span>
            <input
              type="number"
              min={1}
              value={form.salaryMax ?? ""}
              onChange={(e) =>
                update(
                  "salaryMax",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              onBlur={() => markTouched("salaryMax")}
              placeholder="Optional"
              className={inputClass(!!fieldError("salaryMax"))}
            />
            {fieldError("salaryMax") && (
              <span className="text-xs text-red-500">
                {fieldError("salaryMax")}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-(--text-primary)">Currency</span>
            <select
              value={form.currency}
              onChange={(e) => update("currency", e.target.value)}
              className={inputClass(false)}
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
              value={form.openings ?? ""}
              onChange={(e) =>
                update(
                  "openings",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              onBlur={() => markTouched("openings")}
              className={inputClass(!!fieldError("openings"))}
            />
            {fieldError("openings") && (
              <span className="text-xs text-red-500">
                {fieldError("openings")}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-(--text-primary)">
              Application deadline
            </span>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => update("deadline", e.target.value)}
              onBlur={() => markTouched("deadline")}
              className={inputClass(!!fieldError("deadline"))}
            />
            {fieldError("deadline") && (
              <span className="text-xs text-red-500">
                {fieldError("deadline")}
              </span>
            )}
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
              onBlur={() => markTouched("skills")}
              placeholder="Type a skill and press Enter"
              className={`flex-1 ${inputClass(!!fieldError("skills"))}`}
            />
            <button
              type="button"
              onClick={addSkill}
              className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm font-semibold text-(--text-secondary) hover:bg-(--bg)"
            >
              Add
            </button>
          </div>
          {fieldError("skills") && (
            <span className="text-xs text-red-500">{fieldError("skills")}</span>
          )}
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
