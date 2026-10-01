import { useEffect, useRef, useState } from "react";
import {
  Briefcase,
  Camera,
  Globe,
  Loader2,
  MapPin,
  Upload,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateRecruiterProfile } from "../../features/users/hooks/useUpdateRecruiterProfile";
import { useMe } from "../../features/auth/hooks/useMe";
import { useRecruiterLogo } from "../../features/users/hooks/useRecruiterLogo";
import Modal from "../../components/ui/Modal";
import { useGetCurrentUser } from "../../features/users/hooks/useGetCurrentUser";

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
const MAX_LOGO_SIZE_MB = 5;

/* ---------- Presentational helpers (no logic) ---------- */

const inputClass =
  "w-full rounded-(--radius-md) border border-(--border) bg-(--card) px-3.5 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-muted) outline-none transition-[border-color,box-shadow] hover:border-(--text-muted)/50 focus:border-(--primary) focus:ring-4 focus:ring-(--primary)/10";

const Field = ({
  label,
  hint,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <label className={`flex flex-col gap-1.5 ${className}`}>
    <span className="text-sm font-medium text-(--text-primary)">{label}</span>
    {children}
    {hint && <span className="text-xs text-(--text-muted)">{hint}</span>}
  </label>
);

const IconInput = ({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) => (
  <div className="relative">
    <Icon
      size={15}
      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted)"
    />
    {children}
  </div>
);

const SectionHeading = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div>
    <h3 className="font-display text-base font-bold text-(--text-primary)">
      {title}
    </h3>
    <p className="mt-0.5 text-sm text-(--text-secondary)">{description}</p>
  </div>
);

const ProfileSkeleton = () => (
  <div className="grid animate-pulse grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
    <div className="h-80 rounded-(--radius-lg) border border-(--border) bg-(--card)" />
    <div className="h-[32rem] rounded-(--radius-lg) border border-(--border) bg-(--card)" />
  </div>
);

/* ---------- Page ---------- */

const CompanyProfilePage = () => {
  const { data: user, isLoading: isUserLoading } = useGetCurrentUser();
  const queryClient = useQueryClient();
  const updateRecruiterProfileMutation = useUpdateRecruiterProfile();
  const updateLogoMutation = useRecruiterLogo();

  const [draft, setDraft] = useState<CompanyProfile>(emptyProfile);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const update = (field: keyof CompanyProfile, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Logo must be an image file");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_LOGO_SIZE_MB * 1024 * 1024) {
      toast.error(`Logo must be under ${MAX_LOGO_SIZE_MB}MB`);
      e.target.value = "";
      return;
    }

    setLogoPreview(URL.createObjectURL(file));

    try {
      await updateLogoMutation.mutateAsync(file);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Logo updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update logo",
      );
      setLogoPreview(null);
    } finally {
      e.target.value = "";
    }
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
      });
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Company profile updated");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update company profile",
      );
    }
  };

  const isSaving = updateRecruiterProfileMutation.isPending;
  const isUploadingLogo = updateLogoMutation.isPending;

  const initials = draft.name
    .split(" ")
    .filter((w) => /[a-zA-Z]/.test(w[0]))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const logoSrc = logoPreview
    ? logoPreview
    : draft.logo
      ? `${import.meta.env.VITE_API_BACKEND_URL}${draft.logo}`
      : null;

  if (isUserLoading) {
    return (
      <div className="flex flex-col gap-5" aria-busy="true">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="overflow-hidden rounded-(--radius-lg) border border-(--border) bg-(--card) shadow-(--shadow-sm) lg:sticky lg:top-6">
          <div className="relative h-24 bg-gradient-to-br from-(--primary)/20 via-(--primary)/10 to-(--bg)">
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
                backgroundSize: "14px 14px",
              }}
            />
          </div>

          <div className="px-6 pb-6">
            <div className="group relative -mt-10 h-20 w-20">
              <button
                type="button"
                onClick={() => logoSrc && setIsLogoModalOpen(true)}
                disabled={!logoSrc}
                aria-label={logoSrc ? "View company logo" : undefined}
                className="block h-20 w-20 overflow-hidden rounded-(--radius-lg) bg-(--card) shadow-(--shadow-sm) ring-4 ring-(--card) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) disabled:cursor-default"
              >
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    alt={`${draft.name || "Company"} logo`}
                    className={`h-20 w-20 object-cover transition-opacity ${isUploadingLogo ? "opacity-40" : ""}`}
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center bg-(--primary) font-display text-2xl font-bold text-white">
                    {initials || "H"}
                  </div>
                )}
              </button>

              {isUploadingLogo && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-(--primary)" />
                </div>
              )}

              <button
                type="button"
                aria-label="Change company logo"
                onClick={() => logoInputRef.current?.click()}
                disabled={isUploadingLogo}
                className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-full border border-(--border) bg-(--card) text-(--text-secondary) shadow-(--shadow-sm) transition-colors hover:border-(--primary) hover:text-(--primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) disabled:opacity-60"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                disabled={isUploadingLogo}
                className="hidden"
              />
            </div>

            <h3 className="mt-4 font-display text-lg font-bold leading-snug text-(--text-primary)">
              {draft.name || (
                <span className="text-(--text-muted)">Company name</span>
              )}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-(--text-secondary)">
              {draft.tagline || (
                <span className="text-(--text-muted)">Add a short tagline</span>
              )}
            </p>

            {draft.industry && (
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-(--bg) px-2.5 py-1 text-xs font-medium text-(--text-secondary)">
                <Briefcase size={12} className="text-(--text-muted)" />
                {draft.industry}
              </span>
            )}

            <dl className="mt-5 flex flex-col gap-3 border-t border-(--border) pt-5 text-sm">
              <div className="flex items-center gap-3">
                <dt className="sr-only">Website</dt>
                <Globe size={16} className="shrink-0 text-(--text-muted)" />
                <dd className="min-w-0 truncate text-(--text-secondary)">
                  {draft.website || (
                    <span className="text-(--text-muted)">No website</span>
                  )}
                </dd>
              </div>
              <div className="flex items-center gap-3">
                <dt className="sr-only">Headquarters</dt>
                <MapPin size={16} className="shrink-0 text-(--text-muted)" />
                <dd className="min-w-0 truncate text-(--text-secondary)">
                  {draft.headquarters || (
                    <span className="text-(--text-muted)">No location</span>
                  )}
                </dd>
              </div>
              <div className="flex items-center gap-3">
                <dt className="sr-only">Company size</dt>
                <Users size={16} className="shrink-0 text-(--text-muted)" />
                <dd className="min-w-0 truncate text-(--text-secondary)">
                  {draft.size ? (
                    `${draft.size} employees`
                  ) : (
                    <span className="text-(--text-muted)">No size set</span>
                  )}
                </dd>
              </div>
            </dl>

            <p className="mt-5 text-xs text-(--text-muted)">
              Logo: image file, up to {MAX_LOGO_SIZE_MB}MB.
            </p>
          </div>
        </aside>

        <section className="overflow-hidden rounded-(--radius-lg) border border-(--border) bg-(--card) shadow-(--shadow-sm)">
          <div className="flex flex-col gap-8 p-5 sm:p-7">
            <div className="flex flex-col gap-5">
              <SectionHeading
                title="Basics"
                description="Your company name and the one-line pitch shown under it."
              />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Company name">
                  <input
                    value={draft.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Acme Inc."
                    className={inputClass}
                  />
                </Field>

                <Field label="Tagline">
                  <input
                    value={draft.tagline}
                    onChange={(e) => update("tagline", e.target.value)}
                    placeholder="What your company does, in one line"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>

            <div className="h-px bg-(--border)" />

            <div className="flex flex-col gap-5">
              <SectionHeading
                title="Company info"
                description="Helps candidates find and understand your company."
              />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Website">
                  <IconInput icon={Globe}>
                    <input
                      value={draft.website}
                      onChange={(e) => update("website", e.target.value)}
                      placeholder="https://example.com"
                      className={`${inputClass} pl-10`}
                    />
                  </IconInput>
                </Field>

                <Field label="Industry">
                  <IconInput icon={Briefcase}>
                    <input
                      value={draft.industry}
                      onChange={(e) => update("industry", e.target.value)}
                      placeholder="e.g. Software, Healthcare"
                      className={`${inputClass} pl-10`}
                    />
                  </IconInput>
                </Field>

                <Field label="Headquarters">
                  <IconInput icon={MapPin}>
                    <input
                      value={draft.headquarters}
                      onChange={(e) => update("headquarters", e.target.value)}
                      placeholder="City, Country"
                      className={`${inputClass} pl-10`}
                    />
                  </IconInput>
                </Field>

                <Field label="Company size">
                  <IconInput icon={Users}>
                    <select
                      value={draft.size}
                      onChange={(e) => update("size", e.target.value)}
                      className={`${inputClass} pl-10`}
                    >
                      <option value="">Select size</option>
                      {sizeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt} employees
                        </option>
                      ))}
                    </select>
                  </IconInput>
                </Field>
              </div>
            </div>

            <div className="h-px bg-(--border)" />

            {/* About */}
            <div className="flex flex-col gap-5">
              <SectionHeading
                title="About"
                description="Share your mission, culture, and what it’s like to work with you."
              />
              <Field label="Company description">
                <textarea
                  value={draft.about}
                  onChange={(e) => update("about", e.target.value)}
                  rows={6}
                  placeholder="Tell candidates about your company..."
                  className={`${inputClass} resize-y leading-relaxed`}
                />
              </Field>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-(--border) bg-(--bg)/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="rounded-(--radius-md) border border-(--border) bg-(--card) px-4 py-2.5 text-sm font-semibold text-(--text-secondary) transition-colors hover:bg-(--bg) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex min-w-36 items-center justify-center gap-2 rounded-(--radius-md) bg-(--primary) px-5 py-2.5 text-sm font-semibold text-white shadow-(--shadow-sm) transition-colors hover:bg-(--primary-dark) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) disabled:opacity-60"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </section>
      </div>

      <Modal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        title="Company logo"
        maxWidth="max-w-sm"
        footer={
          <>
            <button
              onClick={() => setIsLogoModalOpen(false)}
              className="rounded-(--radius-md) border border-(--border) bg-(--card) px-4 py-2 text-sm font-semibold text-(--text-secondary) hover:bg-(--bg)"
            >
              Close
            </button>
            <button
              onClick={() => {
                setIsLogoModalOpen(false);
                logoInputRef.current?.click();
              }}
              className="flex items-center justify-center gap-2 rounded-(--radius-md) bg-(--primary) px-4 py-2 text-sm font-semibold text-white hover:bg-(--primary-dark)"
            >
              <Upload size={14} />
              Replace logo
            </button>
          </>
        }
      >
        {logoSrc && (
          <div className="flex items-center justify-center rounded-(--radius-md) bg-(--bg) p-6">
            <img
              src={logoSrc}
              alt={`${draft.name || "Company"} logo`}
              className="max-h-48 max-w-full rounded-(--radius-md) object-contain"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CompanyProfilePage;
