import { useRef, useState } from "react";
import {
  LayoutGrid,
  User,
  Briefcase,
  GraduationCap,
  FileText,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import { useMe } from "../../features/auth/hooks/useMe";
import { useUserUpdateProfile } from "../../features/users/hooks/useUpdateUserProfile";
import { useUpdateCandidateProfile } from "../../features/users/hooks/useUpdateCandidateProfile";
import { useRemoveAvatar } from "../../features/users/hooks/useRemoveAvatar";
import { useUpdateAvatar } from "../../features/users/hooks/useUpdateAvatar";
import { useUploadResume } from "../../features/users/hooks/useUploadResume";
import { useRemoveResume } from "../../features/users/hooks/useRemoveResume";

/* ---------- types & helpers ---------- */

type Tab = "overview" | "basic" | "experience" | "education" | "resume";

// One shape for both lists. Experience: title = job title, org = company.
// Education: title = degree, org = school. Dates are "YYYY-MM"; end null = current.
type Entry = {
  id: string;
  title: string;
  org: string;
  start: string;
  end: string | null;
  description?: string;
};

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "basic", label: "Basic", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "resume", label: "Resume", icon: FileText },
] as const;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
// Manual parse so timezones can't shift the month.
const fmt = (v: string) =>
  `${MONTHS[Number(v.slice(5, 7)) - 1]} ${v.slice(0, 4)}`;
const range = (s: string, e: string | null) =>
  `${fmt(s)} — ${e ? fmt(e) : "Present"}`;

const cardCls =
  "rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-sm)]";
const inputCls =
  "w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--primary)] focus:bg-[var(--card)] focus:ring-2 focus:ring-[var(--primary-light)]";
const outlineBtn =
  "flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]";
const iconBtn =
  "rounded-full p-2 text-[var(--text-secondary)] transition hover:bg-[var(--primary-light)] hover:text-[var(--primary)]";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </label>
      {children}
    </div>
  );
}

function Title({
  children,
  onEdit,
}: {
  children: React.ReactNode;
  onEdit?: () => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
        {children}
      </h3>
      {onEdit && (
        <button aria-label="Edit" onClick={onEdit} className={iconBtn}>
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

/* ---------- page ---------- */

export default function CandidateProfilePage() {
  const { data: user, isLoading } = useMe();
  const [tab, setTab] = useState<Tab>("overview");

  // Placeholder data until these have endpoints.
  const [experience, setExperience] = useState<Entry[]>([
    {
      id: "e1",
      title: "Senior Product Designer",
      org: "Loom",
      start: "2022-01",
      end: null,
      description: "Led design for the core recording experience.",
    },
    {
      id: "e2",
      title: "Product Designer",
      org: "Airbnb",
      start: "2019-03",
      end: "2021-12",
    },
  ]);
  const [education, setEducation] = useState<Entry[]>([
    {
      id: "d1",
      title: "B.F.A. Interaction Design",
      org: "RISD",
      start: "2013-09",
      end: "2017-05",
    },
  ]);

  // avatar
  const updateAvatar = useUpdateAvatar();
  const removeAvatar = useRemoveAvatar();
  const avatarRef = useRef<HTMLInputElement>(null);
  const avatarBusy = updateAvatar.isPending || removeAvatar.isPending;

  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return void toast.error("Please select an image file");
    if (file.size > 2 * 1024 * 1024)
      return void toast.error("Image must be under 2 MB");
    updateAvatar.mutate(file);
  };

  if (isLoading || !user) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--text-muted)]">
        Loading profile...
      </div>
    );
  }

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="space-y-6 pb-28 lg:pb-10">
      {/* header */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          {user.avatar ? (
            <img
              src={`${import.meta.env.VITE_API_BACKEND_URL}${user.avatar}`}
              alt=""
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary-light)] font-display text-xl font-bold text-[var(--primary)]">
              {initials}
            </div>
          )}
          <input
            ref={avatarRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatar}
          />
          <button
            aria-label="Change avatar"
            disabled={avatarBusy}
            onClick={() => avatarRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text-secondary)] shadow-[var(--shadow-sm)] hover:text-[var(--primary)] disabled:opacity-50"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          {user.avatar && (
            <button
              aria-label="Remove avatar"
              disabled={avatarBusy}
              onClick={() =>
                removeAvatar
                  .mutateAsync()
                  .catch((e) =>
                    toast.error(e?.message ?? "Failed to remove avatar"),
                  )
              }
              className="absolute -bottom-1 -left-1 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text-secondary)] shadow-[var(--shadow-sm)] hover:text-red-500 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="min-w-0">
          <h1 className="truncate font-display text-xl font-bold text-[var(--text-primary)]">
            {user.firstName} {user.lastName}
          </h1>
          <p className="truncate text-sm text-[var(--text-secondary)]">
            {user.title || "Add a headline"}
          </p>
        </div>
      </div>

      {/* tabs: top bar on desktop, pinned to the bottom on small screens */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-[var(--border)] bg-[var(--card)] pb-[env(safe-area-inset-bottom)] lg:static lg:gap-1 lg:border-b lg:border-t-0 lg:bg-transparent lg:pb-0">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition lg:-mb-px lg:h-auto lg:flex-none lg:flex-row lg:gap-2 lg:border-b-2 lg:px-4 lg:py-3 lg:text-sm ${
              tab === id
                ? "text-[var(--primary)] lg:border-[var(--primary)]"
                : "text-[var(--text-muted)] lg:border-transparent lg:text-[var(--text-secondary)]"
            }`}
          >
            <Icon className="h-5 w-5 lg:h-4 lg:w-4" />
            {label}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <Overview
          user={user}
          experience={experience}
          education={education}
          go={setTab}
        />
      )}
      {tab === "basic" && <Basic key={user.id} user={user} />}
      {tab === "experience" && (
        <EntryList
          heading="Experience"
          titleLabel="Job title"
          orgLabel="Company"
          currentLabel="I currently work here"
          withDescription
          entries={experience}
          setEntries={setExperience}
        />
      )}
      {tab === "education" && (
        <EntryList
          heading="Education"
          titleLabel="Degree"
          orgLabel="School"
          currentLabel="I currently study here"
          entries={education}
          setEntries={setEducation}
        />
      )}
      {tab === "resume" && <Resume resumeUrl={user.resumeUrl ?? null} />}
    </div>
  );
}

/* ---------- Overview ---------- */

function Overview({
  user,
  experience,
  education,
  go,
}: {
  user: any;
  experience: Entry[];
  education: Entry[];
  go: (t: Tab) => void;
}) {
  const resumeUrl = user.resumeUrl ?? null;
  const resumeFullUrl = resumeUrl
    ? `${import.meta.env.VITE_API_BACKEND_URL}${resumeUrl}`
    : null;
  const skills: string[] = user.skills ?? [];
  const checks = [
    user.firstName,
    user.lastName,
    user.title,
    user.location,
    user.bio,
    user.phone,
    skills.length,
    experience.length,
    education.length,
    resumeUrl,
  ];
  const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className={`${cardCls} lg:col-span-2`}>
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-[var(--text-primary)]">
            Profile completion
          </span>
          <span className="font-semibold text-[var(--primary)]">{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--primary-light)]">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className={`${cardCls} lg:col-span-2`}>
        <Title onEdit={() => go("basic")}>About</Title>
        <p className="text-sm text-[var(--text-secondary)]">
          {user.bio || "Tell employers a little about yourself."}
        </p>
        <p className="mt-3 text-sm text-[var(--text-muted)]">
          {[user.location, user.email, user.phone]
            .filter(Boolean)
            .join("  ·  ")}
        </p>
      </div>

      <div className={cardCls}>
        <Title onEdit={() => go("basic")}>Skills</Title>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span
              key={s}
              className="rounded-full bg-[var(--primary-light)] px-3 py-1.5 text-sm font-medium text-[var(--primary)]"
            >
              {s}
            </span>
          ))}
          {!skills.length && (
            <p className="text-sm text-[var(--text-muted)]">
              No skills added yet.
            </p>
          )}
        </div>
      </div>

      <div className={cardCls}>
        <Title onEdit={() => go("resume")}>Resume</Title>

        {resumeUrl ? (
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">
                {resumeUrl.split("/").pop()}
              </p>
              <p className="text-xs text-[var(--text-muted)]">PDF</p>
            </div>

            <a
              href={resumeFullUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[var(--primary)] hover:underline"
            >
              View
            </a>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">
            No resume uploaded yet.
          </p>
        )}
      </div>
      {[
        { name: "Experience", list: experience, tab: "experience" as Tab },
        { name: "Education", list: education, tab: "education" as Tab },
      ].map(({ name, list, tab }) => (
        <div key={name} className={cardCls}>
          <Title onEdit={() => go(tab)}>{name}</Title>
          <div className="space-y-3">
            {list.map((e) => (
              <div key={e.id}>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {e.title}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {e.org} · {range(e.start, e.end)}
                </p>
              </div>
            ))}
            {!list.length && (
              <p className="text-sm text-[var(--text-muted)]">
                Nothing added yet.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Basic info (real hooks) ---------- */

function Basic({ user }: { user: any }) {
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

      {/* save bar: only when something changed, above the bottom tabs on mobile */}
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

/* ---------- Experience / Education (same list + modal) ---------- */

function EntryList({
  heading,
  titleLabel,
  orgLabel,
  currentLabel,
  withDescription,
  entries,
  setEntries,
}: {
  heading: string;
  titleLabel: string;
  orgLabel: string;
  currentLabel: string;
  withDescription?: boolean;
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
}) {
  const [editing, setEditing] = useState<Entry | null>(null);
  const [error, setError] = useState("");
  const blank: Entry = {
    id: "",
    title: "",
    org: "",
    start: "",
    end: null,
    description: "",
  };

  const open = (e: Entry) => {
    setError("");
    setEditing(e);
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!editing) return;
    if (!editing.title.trim() || !editing.org.trim() || !editing.start)
      return setError("Fill in all required fields.");
    if (editing.end && editing.end < editing.start)
      return setError("End date can't be before the start date.");
    setEntries((list) =>
      editing.id
        ? list.map((x) => (x.id === editing.id ? editing : x))
        : [{ ...editing, id: crypto.randomUUID() }, ...list],
    );
    setEditing(null);
  };

  const remove = (e: Entry) => {
    if (window.confirm(`Delete "${e.title}"?`))
      setEntries((list) => list.filter((x) => x.id !== e.id));
  };

  return (
    <div className={cardCls}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
          {heading}
        </h3>
        <button onClick={() => open(blank)} className={outlineBtn}>
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      <div className="space-y-5">
        {entries.map((e) => (
          <div key={e.id} className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {e.title}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {e.org} · {range(e.start, e.end)}
              </p>
              {e.description && (
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {e.description}
                </p>
              )}
            </div>
            <div className="flex shrink-0">
              <button
                aria-label="Edit"
                onClick={() => open(e)}
                className={iconBtn}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                aria-label="Delete"
                onClick={() => remove(e)}
                className={`${iconBtn} hover:!bg-[var(--danger-bg)] hover:!text-[var(--danger)]`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        {!entries.length && (
          <p className="text-sm text-[var(--text-muted)]">
            Nothing here yet. Add your first entry.
          </p>
        )}
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--text-primary)]/40 sm:items-center sm:p-4"
          onMouseDown={(e) => e.target === e.currentTarget && setEditing(null)}
        >
          <form
            onSubmit={submit}
            className="max-h-[90vh] w-full space-y-4 overflow-y-auto rounded-t-[var(--radius-xl)] bg-[var(--card)] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[var(--shadow-lg)] sm:max-w-lg sm:rounded-[var(--radius-lg)]"
          >
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
              {editing.id
                ? `Edit ${heading.toLowerCase()}`
                : `Add ${heading.toLowerCase()}`}
            </h3>
            <Field label={titleLabel}>
              <input
                autoFocus
                className={inputCls}
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
              />
            </Field>
            <Field label={orgLabel}>
              <input
                className={inputCls}
                value={editing.org}
                onChange={(e) =>
                  setEditing({ ...editing, org: e.target.value })
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Start">
                <input
                  type="month"
                  className={inputCls}
                  value={editing.start}
                  onChange={(e) =>
                    setEditing({ ...editing, start: e.target.value })
                  }
                />
              </Field>
              <Field label="End">
                <input
                  type="month"
                  disabled={editing.end === null}
                  className={`${inputCls} disabled:opacity-50`}
                  value={editing.end ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, end: e.target.value })
                  }
                />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--primary)]"
                checked={editing.end === null}
                onChange={(e) =>
                  setEditing({ ...editing, end: e.target.checked ? null : "" })
                }
              />
              {currentLabel}
            </label>
            {withDescription && (
              <Field label="Description">
                <textarea
                  className={`${inputCls} min-h-[80px] resize-y`}
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                />
              </Field>
            )}
            {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/* ---------- Resume ---------- */

function Resume({ resumeUrl }: { resumeUrl: string | null }) {
  const [dragOver, setDragOver] = useState(false);

  const uploadResumeMutation = useUploadResume();
  const removeResumeMutation = useRemoveResume();

  const pick = (file?: File) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      return void toast.error("Upload a PDF file");
    }

    if (file.size > 5 * 1024 * 1024) {
      return void toast.error("File must be under 5 MB");
    }

    uploadResumeMutation.mutate(file, {
      onSuccess: () => {
        toast.success("Resume uploaded successfully");
      },
      onError: () => {
        toast.error("Failed to upload resume");
      },
    });
  };

  const handleRemove = () => {
    removeResumeMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Resume removed successfully");
      },
      onError: () => {
        toast.error("Failed to remove resume");
      },
    });
  };

  return (
    <div className={cardCls}>
      <Title>Resume</Title>

      {resumeUrl && (
        <div className="mb-4 flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] px-3.5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--primary-light)] text-[var(--primary)]">
              <FileText className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {resumeUrl.split("/").pop()}
              </p>

              <p className="text-xs text-[var(--text-muted)]">PDF</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`${import.meta.env.VITE_API_BACKEND_URL}${resumeUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </a>

            <button
              type="button"
              aria-label="Remove resume"
              onClick={handleRemove}
              disabled={removeResumeMutation.isPending}
              className={`${iconBtn} transition hover:!bg-[var(--danger-bg)] hover:!text-[var(--danger)] disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          pick(e.dataTransfer.files?.[0]);
        }}
        className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-[var(--radius-md)] border-2 border-dashed px-4 py-10 text-center transition ${
          dragOver
            ? "border-[var(--primary)] bg-[var(--primary-light)]"
            : "border-[var(--border)] bg-[var(--bg)]"
        }`}
      >
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          disabled={uploadResumeMutation.isPending}
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        <Upload className="h-5 w-5 text-[var(--text-muted)]" />

        <p className="text-sm text-[var(--text-secondary)]">
          {resumeUrl
            ? "Drop a new resume to replace it, or "
            : "Drop your resume here or "}
          <span className="font-medium text-[var(--primary)]">browse</span>
        </p>

        <p className="text-xs text-[var(--text-muted)]">PDF, up to 5 MB</p>
      </label>
    </div>
  );
}
