import { useRef, useState, type ChangeEvent } from "react";
import { Camera, Loader2 } from "lucide-react";
import { SettingsCard, TextField } from "./Shared";
import Button from "../../../components/ui/Button";
import { assetUrl } from "../../../shared/utils/assetUrl";
import Avatar from "../../../shared/components/Avatar";

const MAX_AVATAR_MB = 5;
const NAME_REGEX = /^[\p{L}][\p{L}\s'’.-]*$/u;

type Field = "firstName" | "lastName" | "phone";

const validateName = (value: string, required: boolean): string | undefined => {
  const v = value.trim();
  if (!v) return required ? "This field is required." : undefined;
  if (v.length > 50) return "Must be 50 characters or fewer.";
  if (!NAME_REGEX.test(v))
    return "Only letters, spaces, hyphens and apostrophes are allowed.";
  return undefined;
};

const validatePhone = (value: string): string | undefined => {
  const v = value.trim();
  if (!v) return undefined; // optional
  if (!/^\+?[\d\s\-().]+$/.test(v))
    return "Use only digits, spaces and + - ( ).";
  const digits = v.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15)
    return "Enter a valid phone number (7–15 digits).";
  return undefined;
};

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
  saveError?: string | null;
  onClearSaveError?: () => void;
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
  saveError,
  onClearSaveError,
}: ProfileTabProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const errors: Partial<Record<Field, string>> = {
    firstName: validateName(firstName, true),
    lastName: validateName(lastName, false),
    phone: validatePhone(phone),
  };

  const markTouched = (field: Field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const showError = (field: Field) =>
    touched[field] ? errors[field] : undefined;

  const handleSave = () => {
    // Reveal all errors on the first save attempt
    setTouched({ firstName: true, lastName: true, phone: true });
    if (errors.firstName || errors.lastName || errors.phone) return;
    onSave();
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please choose an image file (JPG, PNG or WebP).");
      return;
    }
    if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
      setAvatarError(`Image must be under ${MAX_AVATAR_MB} MB.`);
      return;
    }

    setAvatarError(null);
    onAvatarSelect(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarError(null);
    removeAvatar();
  };

  const isAvatarBusy = isUploadingAvatar || isRemovingAvatar;
  const fullAvatarUrl = assetUrl(avatarUrl);

  return (
    <SettingsCard
      title="Profile"
      description="Update your personal details."
      footer={
        <Button
          loading={isSaving}
          loadingText="Saving"
          onClick={handleSave}
          disabled={isLoading}
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
          className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-(--border) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--primary) focus-visible:ring-offset-2"
        >
          <Avatar
            src={fullAvatarUrl}
            initials={initials}
            size="xl"
            variant="solid"
          />
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
                onClick={handleRemoveAvatar}
                disabled={isAvatarBusy}
                className="text-sm font-semibold text-(--danger) hover:underline disabled:opacity-50"
              >
                {isRemovingAvatar ? "Removing..." : "Remove"}
              </button>
            )}
          </div>

          {avatarError && (
            <p
              role="alert"
              className="mt-2 text-xs font-medium text-(--danger)"
            >
              {avatarError}
            </p>
          )}
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
          onChange={(v) => {
            onClearSaveError?.();
            onFirstNameChange(v);
          }}
          onBlur={() => markTouched("firstName")}
          error={showError("firstName")}
        />
        <TextField
          label="Last name"
          value={lastName}
          onChange={(v) => {
            onClearSaveError?.();
            onLastNameChange(v);
          }}
          onBlur={() => markTouched("lastName")}
          error={showError("lastName")}
        />
        <TextField
          label="Phone (optional)"
          value={phone}
          onChange={(v) => {
            onClearSaveError?.();
            onPhoneChange(v);
          }}
          onBlur={() => markTouched("phone")}
          error={showError("phone")}
          placeholder="+1 (555) 000-0000"
        />
      </div>

      {saveError && (
        <p role="alert" className="mt-4 text-sm font-medium text-(--danger)">
          {saveError}
        </p>
      )}
    </SettingsCard>
  );
};

export default ProfileTab;
