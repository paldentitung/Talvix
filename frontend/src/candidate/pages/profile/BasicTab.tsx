import { useState } from "react";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { useUserUpdateProfile } from "../../../features/users/hooks/useUpdateUserProfile";
import { useUpdateCandidateProfile } from "../../../features/users/hooks/useUpdateCandidateProfile";
import { Field, Title, cardCls, inputCls, outlineBtn } from "./shared";

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
  const userMut = useUserUpdateProfile();
  const candMut = useUpdateCandidateProfile();
  const saving = userMut.isPending || candMut.isPending;
  const dirty = JSON.stringify(f) !== JSON.stringify(initial);

  const text = (
    key: "firstName" | "lastName" | "phone" | "title" | "location",
  ) => ({
    className: inputCls,
    value: f[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setF({ ...f, [key]: e.target.value }),
  });

  const addSkill = () => {
    const s = newSkill.trim();
    if (!s || f.skills.includes(s)) return;
    setF({ ...f, skills: [...f.skills, s] });
    setNewSkill("");
  };

  const save = async () => {
    try {
      await Promise.all([
        userMut.mutateAsync({
          firstName: f.firstName,
          lastName: f.lastName,
          phone: f.phone,
        }),
        candMut.mutateAsync({
          title: f.title,
          location: f.location,
          bio: f.bio,
          skills: f.skills,
        }),
      ]);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className={cardCls}>
        <Title>Basic information</Title>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="First name">
            <input {...text("firstName")} />
          </Field>
          <Field label="Last name">
            <input {...text("lastName")} />
          </Field>
          <Field label="Phone">
            <input {...text("phone")} />
          </Field>
          <Field label="Headline">
            <input {...text("title")} />
          </Field>
          <Field label="Location">
            <input {...text("location")} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="About">
              <textarea
                className={`${inputCls} min-h-[96px] resize-y`}
                value={f.bio}
                onChange={(e) => setF({ ...f, bio: e.target.value })}
              />
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
          <button onClick={addSkill} className={`${outlineBtn} shrink-0`}>
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
            onClick={() => setF(initial)}
            disabled={saving}
            className="rounded-full px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
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
