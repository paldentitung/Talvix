import { useState, useEffect, useRef } from "react";
import type { ChangeEvent, ReactNode } from "react";
import toast from "react-hot-toast";
import { useGetCurrentUser } from "../../features/users/hooks/useGetCurrentUser";
import { useUserUpdateProfile } from "../../features/users/hooks/useUpdateUserProfile";
import { useUpdateAvatar } from "../../features/users/hooks/useUpdateAvatar";
import { useRemoveAvatar } from "../../features/users/hooks/useRemoveAvatar";
import ChangePasswordCard from "../../shared/components/ChangePasswordCard";
import initials from "../../shared/utils/getInitials";

type AdminTabId = "profile" | "security";

const tabs: { id: AdminTabId; label: string }[] = [
  { id: "profile", label: "Admin Profile" },
  { id: "security", label: "Security" },
];

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2 MB

const Card = ({
  title,
  description,
  badge,
  children,
  footer,
}: {
  title: string;
  description?: string;
  badge?: string;
  children: ReactNode;
  footer?: ReactNode;
}) => (
  <section className="rounded-xl border border-(--border) bg-white">
    <div className="px-5 pt-5">
      <h2 className="flex items-center gap-2 text-base font-semibold text-(--text-primary)">
        {title}
        {badge && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
            {badge}
          </span>
        )}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-(--text-secondary)">{description}</p>
      )}
    </div>
    <div className="px-5 pb-5 pt-4">{children}</div>
    {footer && (
      <div className="flex justify-end gap-2 rounded-b-xl border-t border-(--border) px-5 py-3">
        {footer}
      </div>
    )}
  </section>
);

const TextField = ({
  id,
  label,
  value,
  onChange,
  readOnly = false,
  hint,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  hint?: string;
  type?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-semibold text-(--text-primary)">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange?.(e.target.value)}
      className={`w-full rounded-lg border border-(--border) px-3 py-2.5 text-sm outline-none transition-colors focus:border-(--primary) ${
        readOnly
          ? "cursor-not-allowed bg-gray-50 text-(--text-secondary)"
          : "bg-white text-(--text-primary)"
      }`}
    />
    {hint && <span className="text-xs text-(--text-secondary)">{hint}</span>}
  </div>
);

const AdminProfileSection = () => {
  const { data: currentUser, isLoading } = useGetCurrentUser();
  const { mutate: updateProfile, isPending: isSaving } = useUserUpdateProfile();
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } =
    useUpdateAvatar();
  const { mutate: removeAvatar, isPending: isRemovingAvatar } =
    useRemoveAvatar();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentUser) return;
    setFirstName(currentUser.firstName ?? "");
    setLastName(currentUser.lastName ?? "");
  }, [currentUser]);

  const isDirty =
    firstName.trim() !== (currentUser?.firstName ?? "") ||
    lastName.trim() !== (currentUser?.lastName ?? "");

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First and last name are required.");
      return;
    }

    updateProfile(
      { firstName: firstName.trim(), lastName: lastName.trim() },
      {
        onSuccess: () => toast.success("Profile updated successfully!"),
        onError: (error) =>
          toast.error(error.message || "Failed to update profile."),
      },
    );
  };

  const handleReset = () => {
    setFirstName(currentUser?.firstName ?? "");
    setLastName(currentUser?.lastName ?? "");
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Please choose a JPG or PNG image.");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error("Image must be 2 MB or smaller.");
      return;
    }

    uploadAvatar(file);
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-(--border) bg-white p-5 text-sm text-(--text-secondary)">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card
        title="Profile"
        description="Your personal information shown across the admin panel."
        footer={
          <>
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty || isSaving}
              className="rounded-lg border border-(--border) px-4 py-2 text-sm font-semibold text-(--text-primary) hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="rounded-lg bg-(--primary) px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </>
        }
      >
        {/* Avatar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-full bg-(--primary) text-2xl font-semibold text-white">
            {currentUser?.avatar ? (
              <img
                src={`${import.meta.env.VITE_API_BACKEND_URL}${currentUser.avatar}`}
                alt="Admin avatar"
                className="size-full object-cover"
              />
            ) : (
              initials(`${firstName} ${lastName}`)
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar || isRemovingAvatar}
                className="rounded-lg border border-(--border) px-3 py-1.5 text-sm font-semibold text-(--text-primary) hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploadingAvatar ? "Uploading..." : "Upload new"}
              </button>
              {currentUser?.avatar && (
                <button
                  type="button"
                  onClick={() => removeAvatar()}
                  disabled={isUploadingAvatar || isRemovingAvatar}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isRemovingAvatar ? "Removing..." : "Remove"}
                </button>
              )}
            </div>
            <span className="text-xs text-(--text-secondary)">
              JPG or PNG, up to 2 MB.
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg"
              hidden
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="admin-first-name"
              label="First name"
              value={firstName}
              onChange={setFirstName}
            />
            <TextField
              id="admin-last-name"
              label="Last name"
              value={lastName}
              onChange={setLastName}
            />
          </div>
          <TextField
            id="admin-email"
            label="Email address"
            type="email"
            value={currentUser?.email ?? ""}
            readOnly
            hint="Email can't be changed right now."
          />
        </div>
      </Card>
    </div>
  );
};

const SecuritySection = () => (
  <div className="flex flex-col gap-4">
    <ChangePasswordCard />
  </div>
);

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<AdminTabId>("profile");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 overflow-x-auto border-b border-(--border) pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "border-(--primary) text-(--primary)"
                : "border-transparent text-(--text-secondary) hover:text-(--text-primary)"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && <AdminProfileSection />}
      {activeTab === "security" && <SecuritySection />}
    </div>
  );
};

export default AdminSettingsPage;
