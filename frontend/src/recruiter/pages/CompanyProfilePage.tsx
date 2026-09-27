import { useEffect, useRef, useState } from "react";
import { Globe, Loader2, MapPin, Pencil, Upload, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateRecruiterProfile } from "../../features/users/hooks/useUpdateRecruiterProfile";
import { useMe } from "../../features/auth/hooks/useMe";
import { useRecruiterLogo } from "../../features/users/hooks/useRecruiterLogo";
import Modal from "../../components/ui/Modal";

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

const CompanyProfilePage = () => {
  const { data: user, isLoading: isUserLoading } = useMe();
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
      <div className="flex h-64 items-center justify-center text-sm text-(--text-muted)">
        Loading company profile...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Profile summary card */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-(--radius-lg) border border-(--border) bg-(--card) shadow-(--shadow-sm)">
            <div className="h-14 bg-(--bg)" />

            <div className="px-5 pb-5">
              <div className="group relative -mt-8 h-16 w-16 shrink-0">
                <button
                  type="button"
                  onClick={() => logoSrc && setIsLogoModalOpen(true)}
                  disabled={!logoSrc}
                  className="block h-16 w-16 overflow-hidden rounded-(--radius-md) ring-4 ring-(--card) disabled:cursor-default"
                >
                  {logoSrc ? (
                    <img
                      src={logoSrc}
                      alt={`${draft.name || "Company"} logo`}
                      className={`h-16 w-16 object-cover transition-opacity group-hover:opacity-80 ${isUploadingLogo ? "opacity-50" : ""}`}
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center bg-(--primary) font-display text-xl font-bold text-white">
                      {initials || "H"}
                    </div>
                  )}
                </button>

                {isUploadingLogo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  </div>
                )}

                <button
                  type="button"
                  aria-label="Change company logo"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-(--border) bg-(--card) text-(--text-muted) shadow-(--shadow-sm) transition-colors hover:text-(--primary) disabled:opacity-60"
                >
                  <Pencil className="h-3 w-3" />
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

              <h3 className="mt-3 font-display text-base font-bold text-(--text-primary)">
                {draft.name || "Company name"}
              </h3>
              <p className="mt-0.5 text-sm text-(--text-secondary)">
                {draft.tagline || "Company tagline"}
              </p>

              <div className="mt-4 flex flex-col gap-2.5 border-t border-(--border) pt-4 text-sm text-(--text-secondary)">
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
        </div>

        {/* Editable details */}
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
                  className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none transition-colors focus:border-(--primary)"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-(--text-primary)">
                  Website
                </span>
                <input
                  value={draft.website}
                  onChange={(e) => update("website", e.target.value)}
                  className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none transition-colors focus:border-(--primary)"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-(--text-primary)">
                  Industry
                </span>
                <input
                  value={draft.industry}
                  onChange={(e) => update("industry", e.target.value)}
                  className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none transition-colors focus:border-(--primary)"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-(--text-primary)">
                  Headquarters
                </span>
                <input
                  value={draft.headquarters}
                  onChange={(e) => update("headquarters", e.target.value)}
                  className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none transition-colors focus:border-(--primary)"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-(--text-primary)">
                  Company size
                </span>
                <select
                  value={draft.size}
                  onChange={(e) => update("size", e.target.value)}
                  className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none transition-colors focus:border-(--primary)"
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
                  className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none transition-colors focus:border-(--primary)"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                <span className="font-medium text-(--text-primary)">About</span>
                <textarea
                  value={draft.about}
                  onChange={(e) => update("about", e.target.value)}
                  rows={4}
                  className="resize-none rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none transition-colors focus:border-(--primary)"
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

      {/* Logo preview modal */}
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
