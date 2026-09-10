import { useEffect, useRef, useState } from "react";
import { Globe, MapPin, Pencil, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useUpdateRecruiterProfile } from "../../features/users/hooks/useUpdateRecruiterProfile";
import { useMe } from "../../features/auth/hooks/useMe";

type CompanyProfile = {
  name: string;
  logo: string;
  tagline: string;
  website: string;
  industry: string;
  headquarters: string;
  size: string;
  about: string;
};

const emptyProfile: CompanyProfile = {
  name: "",
  logo: "",
  tagline: "",
  website: "",
  industry: "",
  headquarters: "",
  size: "",
  about: "",
};

const sizeOptions = ["1–10", "11–50", "51–200", "201–500", "500+"];

const CompanyProfilePage = () => {
  const { data: user, isLoading: isUserLoading } = useMe();
  const updateRecruiterProfileMutation = useUpdateRecruiterProfile();

  const [draft, setDraft] = useState<CompanyProfile>(emptyProfile);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Sync form state from real user data once it loads
  useEffect(() => {
    if (!user) return;
    setDraft({
      name: user.companyName ?? "",
      logo: user.companyLogo ?? "",
      tagline: user.companyTagline ?? "",
      website: user.companyWebsite ?? "",
      industry: user.companyIndustry ?? "",
      headquarters: user.companyLocation ?? "",
      size: user.companySize ?? "",
      about: user.companyDescription ?? "",
    });
  }, [user]);

  const update = (field: keyof CompanyProfile, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: wire up to the dedicated logo upload endpoint once it's ready.
    // Left as a no-op for now — logo is not editable from this page yet.
    e.target.value = "";
  };

  const handleCancel = () => {
    if (!user) return;
    setDraft({
      name: user.companyName ?? "",
      logo: user.companyLogo ?? "",
      tagline: user.companyTagline ?? "",
      website: user.companyWebsite ?? "",
      industry: user.companyIndustry ?? "",
      headquarters: user.companyLocation ?? "",
      size: user.companySize ?? "",
      about: user.companyDescription ?? "",
    });
  };

  const handleSave = async () => {
    try {
      await updateRecruiterProfileMutation.mutateAsync({
        companyName: draft.name,
        companyWebsite: draft.website,
        companyLocation: draft.headquarters,
        companyDescription: draft.about,
        companyTagline: draft.tagline,
        companyIndustry: draft.industry,
        companySize: draft.size,
        // companyLogo intentionally omitted — logo is saved via its own upload endpoint
      });
      toast.success("Company profile updated");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update company profile",
      );
    }
  };

  const isSaving = updateRecruiterProfileMutation.isPending;

  const initials = draft.name
    .split(" ")
    .filter((w) => /[a-zA-Z]/.test(w[0]))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (isUserLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-(--text-muted)">
        Loading company profile...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm)">
            <div className="group relative h-12 w-12 shrink-0">
              {draft.logo ? (
                <img
                  src={draft.logo}
                  alt={`${draft.name || "Company"} logo`}
                  className="h-12 w-12 rounded-(--radius-md) object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-(--radius-md) bg-(--primary) font-display text-lg font-bold text-white">
                  {initials || "H"}
                </div>
              )}
              <button
                type="button"
                aria-label="Change company logo"
                disabled
                title="Coming soon"
                onClick={() => logoInputRef.current?.click()}
                className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-(--border) bg-(--card) text-(--text-muted) shadow-(--shadow-sm) opacity-60"
              >
                <Pencil className="h-3 w-3" />
              </button>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                disabled
                onChange={handleLogoFileChange}
                className="hidden"
              />
            </div>
            <h3 className="mt-3 font-display text-base font-bold text-(--text-primary)">
              {draft.name || "Company name"}
            </h3>
            <p className="mt-1 text-sm text-(--text-secondary)">
              {draft.tagline || "Company tagline"}
            </p>

            <div className="mt-5 flex flex-col gap-2.5 border-t border-(--border) pt-4 text-sm text-(--text-secondary)">
              <span className="flex items-center gap-2">
                <Globe size={15} className="shrink-0 text-(--text-muted)" />
                <span className="truncate">{draft.website || "—"}</span>
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={15} className="shrink-0 text-(--text-muted)" />
                <span className="truncate">{draft.headquarters || "—"}</span>
              </span>
              <span className="flex items-center gap-2">
                <Users size={15} className="shrink-0 text-(--text-muted)" />
                <span className="truncate">
                  {draft.size ? `${draft.size} employees` : "—"}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) sm:p-6">
            <h3 className="font-display text-base font-bold text-(--text-primary)">
              Company details
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-(--text-primary)">
                  Company name
                </span>
                <input
                  value={draft.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-(--text-primary)">
                  Website
                </span>
                <input
                  value={draft.website}
                  onChange={(e) => update("website", e.target.value)}
                  className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-(--text-primary)">
                  Industry
                </span>
                <input
                  value={draft.industry}
                  onChange={(e) => update("industry", e.target.value)}
                  className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-(--text-primary)">
                  Headquarters
                </span>
                <input
                  value={draft.headquarters}
                  onChange={(e) => update("headquarters", e.target.value)}
                  className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-(--text-primary)">
                  Company size
                </span>
                <select
                  value={draft.size}
                  onChange={(e) => update("size", e.target.value)}
                  className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
                >
                  <option value="">—</option>
                  {sizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-(--text-primary)">
                  Tagline
                </span>
                <input
                  value={draft.tagline}
                  onChange={(e) => update("tagline", e.target.value)}
                  className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                <span className="font-medium text-(--text-primary)">About</span>
                <textarea
                  value={draft.about}
                  onChange={(e) => update("about", e.target.value)}
                  rows={4}
                  className="resize-none rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 border-t border-(--border) pt-5 sm:flex-row sm:justify-end">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="rounded-(--radius-md) border border-(--border) bg-(--card) px-4 py-2 text-sm font-semibold text-(--text-secondary) hover:bg-(--bg) disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-(--radius-md) bg-(--primary) px-4 py-2 text-sm font-semibold text-white hover:bg-(--primary-dark) disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
