import { useState } from "react";
import {
  LayoutGrid,
  User,
  Briefcase,
  GraduationCap,
  FileText,
} from "lucide-react";
import { useMe } from "../../../features/auth/hooks/useMe";
import ProfileHeader from "./ProfileHeader";
import OverviewTab from "./OverviewTab";
import BasicTab from "./BasicTab";
import ResumeTab from "./ResumeTab";
import EducationSection, { toEducationEntry } from "./EducationSection";
import ExperienceSection, { toExperienceEntry } from "./ExperienceSection";
import type { Tab } from "./shared";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "basic", label: "Basic", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "resume", label: "Resume", icon: FileText },
] as const;

export default function CandidateProfilePage() {
  const { data: user, isLoading } = useMe();
  const [tab, setTab] = useState<Tab>("overview");

  if (isLoading || !user) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--text-muted)]">
        Loading profile...
      </div>
    );
  }

  const educations = user.educations ?? [];
  const experiences = user.experiences ?? [];

  return (
    <div className="space-y-6 pb-28 lg:pb-10">
      <ProfileHeader user={user} />

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
        <OverviewTab
          user={user}
          experience={experiences.map(toExperienceEntry)}
          education={educations.map(toEducationEntry)}
          go={setTab}
        />
      )}
      {tab === "basic" && <BasicTab key={user.id} user={user} />}
      {tab === "experience" && <ExperienceSection experience={experiences} />}
      {tab === "education" && <EducationSection education={educations} />}
      {tab === "resume" && <ResumeTab resumeUrl={user.resumeUrl ?? null} />}
    </div>
  );
}
