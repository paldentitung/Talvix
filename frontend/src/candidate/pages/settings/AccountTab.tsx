import { useState, useRef } from "react";
import { User, Plus, X, Loader2, Upload, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { useUserUpdateProfile } from "../../../features/users/hooks/useUpdateUserProfile";
import { useUpdateCandidateProfile } from "../../../features/users/hooks/useUpdateCandidateProfile";
import { useUploadResume } from "../../../features/users/hooks/useUploadResume";
import { Card, FieldLabel, SectionHeading, TextField } from "./shared";

export default function AccountTab({ user }: { user: any }) {
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

  const fileRef = useRef<HTMLInputElement>(null);
  const uploadMut = useUploadResume();
  const userMut = useUserUpdateProfile();
  const candMut = useUpdateCandidateProfile();

  const saving = userMut.isPending || candMut.isPending;
  const dirty = JSON.stringify(f) !== JSON.stringify(initial);

  const set = (key: keyof typeof initial) => (v: string) =>
    setF((prev) => ({ ...prev, [key]: v }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.type !== "application/pdf" || !/\.pdf$/i.test(file.name))
      return toast.error("Only PDF files are allowed.");
    if (file.size > 5 * 1024 * 1024)
      return toast.error("File must be under 5 MB.");

    uploadMut.mutate(file, {
      onSuccess: () => toast.success("Resume uploaded"),
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : "Upload failed"),
    });
  };
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
    <>
      <Card className="p-6 sm:p-7">
        <SectionHeading
          icon={User}
          title="Basic information"
          subtitle="This is what recruiters see."
        />
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextField
            label="First name"
            value={f.firstName}
            onChange={set("firstName")}
          />
          <TextField
            label="Last name"
            value={f.lastName}
            onChange={set("lastName")}
          />
          <TextField
            label="Email"
            value={user.email ?? ""}
            onChange={() => {}}
            type="email"
            disabled
          />
          <TextField label="Phone" value={f.phone} onChange={set("phone")} />
          <TextField label="Headline" value={f.title} onChange={set("title")} />
          <TextField
            label="Location"
            value={f.location}
            onChange={set("location")}
          />

          {/* Resume upload (saved immediately, not part of the form state) */}
          <div className="sm:col-span-2">
            <FieldLabel>Resume</FieldLabel>

            <label
              className={`flex items-center justify-between gap-3 rounded-[10px] border bg-white px-3.5 py-2.5 transition-colors focus-within:ring-2 ${
                uploadMut.isPending
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:bg-[var(--bg)]"
              }`}
              style={
                {
                  borderColor: "var(--border)",
                  "--tw-ring-color": "var(--primary-light)",
                } as React.CSSProperties
              }
            >
              {/* sr-only (not display:none) keeps the input keyboard-focusable */}
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFile}
                disabled={uploadMut.isPending}
                className="sr-only"
              />

              <div className="flex min-w-0 items-center gap-2.5">
                <FileText
                  className="h-4 w-4 shrink-0"
                  style={{ color: "var(--text-muted)" }}
                />
                {user.resumeUrl ? (
                  <a
                    href={`${import.meta.env.VITE_API_BACKEND_URL}${user.resumeUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()} // open the file, don't open the picker
                    className="truncate text-sm font-medium underline-offset-2 hover:underline"
                    style={{ color: "var(--primary)" }}
                  >
                    {decodeURIComponent(
                      user.resumeUrl.split("/").pop() ?? "View resume",
                    )}
                  </a>
                ) : (
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    No resume uploaded. Click to upload
                  </span>
                )}
              </div>

              <span
                className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border px-3 py-1.5 text-sm font-medium"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              >
                {uploadMut.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                {user.resumeUrl ? "Replace" : "Upload"}
              </span>
            </label>

            <p
              className="mt-1.5 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              PDF only, up to 5 MB. Saved as soon as it uploads.
            </p>
          </div>

          <div className="sm:col-span-2">
            <FieldLabel>About</FieldLabel>
            <textarea
              rows={4}
              value={f.bio}
              onChange={(e) => set("bio")(e.target.value)}
              className="min-h-[96px] w-full resize-y rounded-[10px] border bg-white px-3.5 py-2.5 text-sm outline-none focus:ring-2"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-7">
        <SectionHeading
          icon={User}
          title="Skills"
          subtitle="Add the skills you want to be found for."
        />
        <div className="mt-6 flex gap-2">
          <input
            placeholder="Add a skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addSkill())
            }
            className="w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-sm outline-none focus:ring-2"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          />
          <button
            type="button"
            onClick={addSkill}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border px-4 py-2.5 text-sm font-medium"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {f.skills.map((s) => (
            <span
              key={s}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
              style={{
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
              }}
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
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No skills added yet.
            </p>
          )}
        </div>
      </Card>

      {dirty && (
        <div
          className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom)+0.75rem)] right-4 z-20 flex items-center gap-3 rounded-full border px-3 py-2 lg:bottom-6 lg:right-6"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--card)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <button
            type="button"
            onClick={() => setF(initial)}
            disabled={saving}
            className="rounded-full px-4 py-2 text-sm font-medium disabled:opacity-50"
            style={{ color: "var(--text-secondary)" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      )}
    </>
  );
}
