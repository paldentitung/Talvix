import React, { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Pencil,
  Plus,
  Upload,
  FileText,
  GraduationCap,
  Briefcase,
  X,
} from "lucide-react";
import { FaGithub, FaGlobe, FaLinkedin } from "react-icons/fa";
import toast from "react-hot-toast";
import { useUserUpdateProfile } from "../../features/users/hooks/useUpdateUserProfile";
import { useUpdateCandidateProfile } from "../../features/users/hooks/useUpdateCandidateProfile";
import { useMe } from "../../features/auth/hooks/useMe";

/**
 * CandidateProfilePage
 * "My profile" screen for the Job Seeker workspace.
 * Sidebar and top nav are rendered by the app shell — this component is page content only.
 */

type ExperienceEntry = {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
};

type EducationEntry = {
  id: string;
  school: string;
  degree: string;
  period: string;
};

// Experience/Education don't have backend endpoints yet — still static for now.
const initialExperience: ExperienceEntry[] = [
  {
    id: "exp-1",
    title: "Senior Product Designer",
    company: "Loom",
    period: "2022 — Present",
    description: "Led design for the core recording experience.",
  },
  {
    id: "exp-2",
    title: "Product Designer",
    company: "Airbnb",
    period: "2019 — 2022",
    description: "Trust & safety, host onboarding.",
  },
  {
    id: "exp-3",
    title: "UI Designer",
    company: "Freelance",
    period: "2017 — 2019",
    description: "",
  },
];

const initialEducation: EducationEntry[] = [
  {
    id: "edu-1",
    school: "RISD",
    degree: "B.F.A. Interaction Design",
    period: "2013 — 2017",
  },
];

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)] ${className}`}
    >
      {children}
    </div>
  );
}

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

const inputClasses =
  "w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--primary)] focus:bg-[var(--card)] focus:ring-2 focus:ring-[var(--primary-light)]";

export default function CandidateProfilePage() {
  const { data: user, isLoading: isUserLoading } = useMe();

  const updateUserProfileMutation = useUserUpdateProfile();
  const updateCandidateProfileMutation = useUpdateCandidateProfile();

  // Local form state — seeded from `user` once it loads
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const [experience] = useState<ExperienceEntry[]>(initialExperience);
  const [education] = useState<EducationEntry[]>(initialEducation);
  const [resumeName] = useState("alex-morgan-resume.pdf");
  const [dragOver, setDragOver] = useState(false);

  // Sync form state whenever the real user data arrives (or changes elsewhere)
  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setPhone(user.phone ?? "");
    setTitle(user.title ?? "");
    setLocation(user.location ?? "");
    setBio(user.bio ?? "");
    setSkills(user.skills ?? []);
  }, [user]);

  const email = user?.email ?? "";

  const completion = useMemo(() => {
    const fields = [firstName, lastName, title, location, bio, email, phone];
    const filled = fields.filter((f) => f.trim().length > 0).length;
    const base = Math.round((filled / fields.length) * 90);
    return Math.min(100, base + (skills.length > 0 ? 10 : 0));
  }, [firstName, lastName, title, location, bio, email, phone, skills]);

  const removeSkill = (skill: string) =>
    setSkills((prev) => prev.filter((s) => s !== skill));

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    setSkills((prev) => [...prev, trimmed]);
    setNewSkill("");
  };

  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

  const isSaving =
    updateUserProfileMutation.isPending ||
    updateCandidateProfileMutation.isPending;

  const handleSave = async () => {
    try {
      await Promise.all([
        updateUserProfileMutation.mutateAsync({
          firstName,
          lastName,
          phone,
        }),
        updateCandidateProfileMutation.mutateAsync({
          title,
          location,
          bio,
          skills,
        }),
      ]);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile",
      );
    }
  };

  const handleCancel = () => {
    if (!user) return;
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setPhone(user.phone ?? "");
    setTitle(user.title ?? "");
    setLocation(user.location ?? "");
    setBio(user.bio ?? "");
    setSkills(user.skills ?? []);
  };

  if (isUserLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--text-muted)]">
        Loading profile...
      </div>
    );
  }

  return (
    <div className=" space-y-6 pb-28">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Identity card */}
          <Card className="overflow-hidden">
            <div
              className="h-24 w-full"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
              }}
            />
            <div className="px-5 pb-5">
              <div className="-mt-10 flex items-end justify-between">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--card)] bg-[var(--primary-light)] font-display text-xl font-bold text-[var(--primary)]">
                  {initials}
                </div>
                <button
                  aria-label="Edit profile"
                  className="mb-1 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text-secondary)] shadow-[var(--shadow-sm)] transition hover:text-[var(--primary)]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>

              <h2 className="mt-3 font-display text-lg font-bold text-[var(--text-primary)]">
                {firstName} {lastName}
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">{title}</p>

              <div className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[var(--text-muted)]" />
                  {location || "No location set"}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[var(--text-muted)]" />
                  {email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[var(--text-muted)]" />
                  {phone || "No phone set"}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                {[FaLinkedin, FaGithub, FaGlobe].map((Icon, i) => (
                  <button
                    key={i}
                    aria-label="Social link"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary)] transition hover:bg-[var(--accent-light)] hover:text-[var(--accent)]"
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Resume card */}
          <Card className="p-5">
            <h3 className="mb-3 font-display text-base font-semibold text-[var(--text-primary)]">
              Resume
            </h3>
            <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] px-3.5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--primary-light)] text-[var(--primary)]">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {resumeName}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Updated 2 days ago · 284 KB
                  </p>
                </div>
              </div>
              <button className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-dark)]">
                Replace
              </button>
            </div>

            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
              }}
              className={`mt-3 flex cursor-pointer flex-col items-center gap-1.5 rounded-[var(--radius-md)] border-2 border-dashed px-4 py-6 text-center transition ${
                dragOver
                  ? "border-[var(--primary)] bg-[var(--primary-light)]"
                  : "border-[var(--border)] bg-[var(--bg)]"
              }`}
            >
              <input type="file" accept=".pdf,.docx" className="hidden" />
              <Upload className="h-5 w-5 text-[var(--text-muted)]" />
              <p className="text-sm text-[var(--text-secondary)]">
                Drop a new resume or{" "}
                <span className="font-medium text-[var(--primary)]">
                  browse
                </span>
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                PDF, DOCX up to 5 MB
              </p>
            </label>
          </Card>

          {/* Skills card */}
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
                Skills
              </h3>
            </div>
            <div className="mb-3 flex gap-2">
              <input
                className={inputClasses}
                placeholder="Add a skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <button
                onClick={addSkill}
                className="flex items-center gap-1 whitespace-nowrap rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="group flex items-center gap-1.5 rounded-full bg-[var(--primary-light)] px-3 py-1.5 text-sm font-medium text-[var(--primary)]"
                >
                  {skill}
                  <button
                    aria-label={`Remove ${skill}`}
                    onClick={() => removeSkill(skill)}
                    className="opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {skills.length === 0 && (
                <p className="text-sm text-[var(--text-muted)]">
                  No skills added yet.
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Basic information */}
          <Card className="p-6">
            <h3 className="mb-5 font-display text-base font-semibold text-[var(--text-primary)]">
              Basic information
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First name">
                <input
                  className={inputClasses}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Field>
              <Field label="Last name">
                <input
                  className={inputClasses}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Field>
              <Field label="Phone">
                <input
                  className={inputClasses}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Field>
              <Field label="Headline">
                <input
                  className={inputClasses}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>
              <Field label="Location">
                <input
                  className={inputClasses}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="About">
                  <textarea
                    className={`${inputClasses} min-h-[96px] resize-y`}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </Field>
              </div>
            </div>
          </Card>

          {/* Experience */}
          <Card className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-base font-semibold text-[var(--text-primary)]">
                <Briefcase className="h-4 w-4 text-[var(--text-muted)]" />
                Experience
              </h3>
              <button className="flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]">
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>

            <div className="space-y-6">
              {experience.map((entry, i) => (
                <div key={entry.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    {i < experience.length - 1 && (
                      <div className="mt-1 w-px flex-1 bg-[var(--border)]" />
                    )}
                  </div>
                  <div className="pb-1">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {entry.title}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {entry.company} · {entry.period}
                    </p>
                    {entry.description && (
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {entry.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Education */}
          <Card className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-base font-semibold text-[var(--text-primary)]">
                <GraduationCap className="h-4 w-4 text-[var(--text-muted)]" />
                Education
              </h3>
              <button className="flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]">
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>

            <div className="space-y-4">
              {education.map((entry) => (
                <div key={entry.id} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-light)] text-[var(--accent)]">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {entry.degree}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {entry.school} · {entry.period}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Floating save bar */}
      <div className="fixed bottom-6 right-6 z-10 flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-[var(--shadow-lg)]">
        <button
          onClick={handleCancel}
          disabled={isSaving}
          className="rounded-full px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg)] disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)] disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}
