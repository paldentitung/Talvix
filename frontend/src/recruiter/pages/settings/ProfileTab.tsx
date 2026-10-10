import { useRef, type ChangeEvent } from "react";
import { Camera, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { SettingsCard, TextField } from "./Shared";
import Button from "../../../components/ui/Button";

const MAX_AVATAR_MB = 5;

type ProfileTabProps = {
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl?: string | null;
  initials: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onAvatarSelect: (file: File) => void;
  onSave: () => void;
  isSaving: boolean;
  isUploadingAvatar: boolean;
  isLoading: boolean;
  removeAvatar: () => void;
  isRemovingAvatar: boolean;
};

const ProfileTab = ({
  firstName,
  lastName,
  phone,
  avatarUrl,
  initials,
  onFirstNameChange,
  onLastNameChange,
  onPhoneChange,
  onAvatarSelect,
  onSave,
  isSaving,
  isUploadingAvatar,
  isLoading,
  removeAvatar,
  isRemovingAvatar,
}: ProfileTabProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
      toast.error(`Image must be under ${MAX_AVATAR_MB} MB.`);
      return;
    }

    onAvatarSelect(file);
  };
  const isAvatarBusy = isUploadingAvatar || isRemovingAvatar;
  return (
    <SettingsCard
      title="Profile"
      description="Update your personal details."
      footer={
        <Button
          loading={isSaving}
          loadingText="Saving"
          onClick={onSave}
          disabled={isLoading || !firstName.trim()}
        >
          Save changes
        </Button>
      }
    >
      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isAvatarBusy}
          aria-label="Change profile photo"
          className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-(--border) bg-(--primary) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--primary) focus-visible:ring-offset-2"
        >
          {avatarUrl ? (
            <img
              src={`${import.meta.env.VITE_API_BACKEND_URL}${avatarUrl}`}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xl font-semibold text-white">
              {initials}
            </span>
          )}
          <span
            className={`absolute inset-0 flex items-center justify-center bg-black/40 text-white transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${
              isAvatarBusy ? "opacity-100" : "opacity-0"
            }`}
          >
            {isAvatarBusy ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Camera className="h-5 w-5" />
            )}
          </span>
        </button>

        <div>
          <p className="text-sm font-medium text-(--text-primary)">
            Profile photo
          </p>
          <p className="text-xs text-(--text-secondary)">
            JPG, PNG or WebP. Max {MAX_AVATAR_MB} MB.
          </p>
          <div className="mt-1 flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAvatarBusy}
              className="text-sm font-semibold text-(--primary) hover:underline disabled:opacity-50"
            >
              {isUploadingAvatar ? "Uploading..." : "Change photo"}
            </button>

            {avatarUrl && (
              <button
                type="button"
                onClick={removeAvatar}
                disabled={isAvatarBusy}
                className="text-sm font-semibold text-(--danger) hover:underline disabled:opacity-50"
              >
                {isRemovingAvatar ? "Removing..." : "Remove"}
              </button>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="First name"
          value={firstName}
          onChange={onFirstNameChange}
        />
        <TextField
          label="Last name"
          value={lastName}
          onChange={onLastNameChange}
        />
        <TextField
          label="Phone (optional)"
          value={phone}
          onChange={onPhoneChange}
          placeholder="+1 (555) 000-0000"
        />
      </div>
    </SettingsCard>
  );
};

export default ProfileTab;
