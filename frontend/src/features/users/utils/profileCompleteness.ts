export interface ProfileCompletenessInput {
  firstName?: string | null;
  lastName?: string | null;
  title?: string | null;
  location?: string | null;
  bio?: string | null;
  phone?: string | null;
  skills?: string[] | null;
  experiences?: unknown[] | null;
  educations?: unknown[] | null;
  resumeUrl?: string | null;
}

export interface ProfileCheck {
  label: string;
  done: boolean;
}

export const getProfileCompleteness = (user: ProfileCompletenessInput) => {
  const checks: ProfileCheck[] = [
    {
      label: "First name",
      done: Boolean(user.firstName),
    },
    {
      label: "Last name",
      done: Boolean(user.lastName),
    },
    {
      label: "Headline",
      done: Boolean(user.title),
    },
    {
      label: "Location",
      done: Boolean(user.location),
    },
    {
      label: "Bio",
      done: Boolean(user.bio),
    },
    {
      label: "Phone",
      done: Boolean(user.phone),
    },
    {
      label: "Skills",
      done: Boolean(user.skills?.length),
    },
    {
      label: "Experience",
      done: Boolean(user.experiences?.length),
    },
    {
      label: "Education",
      done: Boolean(user.educations?.length),
    },
    {
      label: "Resume",
      done: Boolean(user.resumeUrl),
    },
  ];

  const completed = checks.filter((check) => check.done).length;
  const total = checks.length;
  const remaining = total - completed;

  const percentage = Math.round((completed / total) * 100);

  return {
    checks,
    completed,
    total,
    remaining,
    percentage,
  };
};
