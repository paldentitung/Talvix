import { useState } from "react";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { useUserUpdateProfile } from "../../../features/users/hooks/useUpdateUserProfile";
import { useUpdateCandidateProfile } from "../../../features/users/hooks/useUpdateCandidateProfile";
import { Field, Title, cardCls, inputCls, outlineBtn } from "./shared";

type FormKey =
  | "firstName"
  | "lastName"
  | "phone"
  | "title"
  | "location"
  | "bio";

const validators: Partial<Record<FormKey, (v: string) => string | undefined>> =
  {
    firstName: (v) => {
      if (!v.trim()) return "First name is required.";
      if (v.trim().length > 50) return "Must be 50 characters or fewer.";
    },
    lastName: (v) => {
      if (v.trim().length > 50) return "Must be 50 characters or fewer.";
    },
    phone: (v) => {
      const t = v.trim();
      if (!t) return undefined; // optional
      if (!/^\+?[\d\s\-().]+$/.test(t)) return "Enter a valid phone number.";
      const digits = t.replace(/\D/g, "");
      if (digits.length < 7 || digits.length > 15)
        return "Phone number must be 7–15 digits.";
    },
    title: (v) => {
      if (v.trim().length > 100) return "Must be 100 characters or fewer.";
    },
    location: (v) => {
      if (v.trim().length > 100) return "Must be 100 characters or fewer.";
    },
    bio: (v) => {
      if (v.trim().length > 500) return "Must be 500 characters or fewer.";
    },
  };

const FormError = ({ message }: { message?: string }) =>
  message ? (
    <p role="alert" className="mt-1 text-xs font-medium text-red-500">
      {message}
    </p>
  ) : null;

export default function BasicTab({ user }: { user: any }) {
  const initial = {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    phone: user.phone ?? "",
    title: user.title ?? "",
    location: user.location ?? "",
    bio: user.bio ?? "",
    skills: (user.skills ?? []) as string[],
  };
  const [f, setF] = useState(initial);
  const [newSkill, setNewSkill] = useState("");
  const [touched, setTouched] = useState<Partial<Record<FormKey, boolean>>>({});

  const userMut = useUserUpdateProfile();
  const candMut = useUpdateCandidateProfile();
  const saving = userMut.isPending || candMut.isPending;
  const dirty = JSON.stringify(f) !== JSON.stringify(initial);

  const errors: Partial<Record<FormKey, string>> = {};
  (Object.keys(validators) as FormKey[]).forEach((key) => {
    errors[key] = validators[key]?.(f[key]);
  });

  const showError = (key: FormKey) => (touched[key] ? errors[key] : undefined);
  const markTouched = (key: FormKey) =>
    setTouched((prev) => ({ ...prev, [key]: true }));

  const text = (key: Exclude<FormKey, "bio">) => ({
    className: `${inputCls} ${showError(key) ? "!border-red-500" : ""}`,
    value: f[key],
    "aria-invalid": !!showError(key),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setF({ ...f, [key]: e.target.value }),
    onBlur: () => markTouched(key),
  });

  const addSkill = () => {
    const s = newSkill.trim();
    if (!s || f.skills.some((x) => x.toLowerCase() === s.toLowerCase())) return;
    setF({ ...f, skills: [...f.skills, s] });
    setNewSkill("");
  };

  const handleCancel = () => {
    setF(initial);
    setTouched({});
    setNewSkill("");
  };

  const save = async () => {
    // Reveal all errors on save
    setTouched({
      firstName: true,
      lastName: true,
      phone: true,
      title: true,
      location: true,
      bio: true,
    });
    if (Object.values(errors).some(Boolean)) return;

    try {
      await Promise.all([
        userMut.mutateAsync({
          firstName: f.firstName.trim(),
          lastName: f.lastName.trim(),
          phone: f.phone.trim(),
        }),
        candMut.mutateAsync({
          title: f.title.trim(),
          location: f.location.trim(),
          bio: f.bio.trim(),
          skills: f.skills,
        }),
      ]);
      toast.success("Profile updated successfully");
    } catch {
      // Backend errors are already toasted by the API layer.
    }
  };

  return (
    <div className="space-y-6">
      <div className={cardCls}>
        <Title>Basic information</Title>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="First name">
            <input {...text("firstName")} />
            <FormError message={showError("firstName")} />
          </Field>
          <Field label="Last name">
            <input {...text("lastName")} />
            <FormError message={showError("lastName")} />
          </Field>
          <Field label="Phone">
            <input {...text("phone")} />
            <FormError message={showError("phone")} />
          </Field>
          <Field label="Headline">
            <input {...text("title")} />
            <FormError message={showError("title")} />
          </Field>
          <Field label="Location">
            <input {...text("location")} />
            <FormError message={showError("location")} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="About">
              <textarea
                className={`${inputCls} min-h-[96px] resize-y ${
                  showError("bio") ? "!border-red-500" : ""
                }`}
                value={f.bio}
                aria-invalid={!!showError("bio")}
                onChange={(e) => setF({ ...f, bio: e.target.value })}
                onBlur={() => markTouched("bio")}
              />
              <div className="flex justify-between">
                <FormError message={showError("bio")} />
                <span className="ml-auto mt-1 text-xs text-[var(--text-muted)]">
                  {f.bio.trim().length}/500
                </span>
              </div>
            </Field>
          </div>
        </div>
      </div>

      <div className={cardCls}>
        <Title>Skills</Title>
        <div className="mb-3 flex gap-2">
          <input
            className={inputCls}
            placeholder="Add a skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addSkill())
            }
          />
          <button
            type="button"
            onClick={addSkill}
            className={`${outlineBtn} shrink-0`}
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {f.skills.map((s) => (
            <span
              key={s}
              className="flex items-center gap-1.5 rounded-full bg-[var(--primary-light)] px-3 py-1.5 text-sm font-medium text-[var(--primary)]"
            >
              {s}
              <button
                type="button"
                aria-label={`Remove ${s}`}
                onClick={() =>
                  setF({ ...f, skills: f.skills.filter((x) => x !== s) })
                }
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {!f.skills.length && (
            <p className="text-sm text-[var(--text-muted)]">
              No skills added yet.
            </p>
          )}
        </div>
      </div>

      {dirty && (
        <div className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom)+0.75rem)] right-4 z-20 flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-[var(--shadow-lg)] lg:bottom-6 lg:right-6">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="rounded-full px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      )}
    </div>
  );
}
