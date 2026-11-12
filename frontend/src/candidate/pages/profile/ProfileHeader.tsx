import { useRef, useState } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { useRemoveAvatar } from "../../../features/users/hooks/useRemoveAvatar";
import { useUpdateAvatar } from "../../../features/users/hooks/useUpdateAvatar";
import Modal from "../../../components/ui/Modal";
import Avatar from "../../../shared/components/Avatar";
import { assetUrl } from "../../../shared/utils/assetUrl";
import { cardCls } from "./shared";

const MAX_SIZE = 2 * 1024 * 1024;

export default function ProfileHeader({ user }: { user: any }) {
  const updateAvatar = useUpdateAvatar();
  const removeAvatar = useRemoveAvatar();
  const avatarRef = useRef<HTMLInputElement>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const busy = updateAvatar.isPending || removeAvatar.isPending;

  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select an image file.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setAvatarError("Image must be under 2 MB.");
      return;
    }

    setAvatarError(null);
    updateAvatar.mutate(file, {
      onError: (e) =>
        setAvatarError(e instanceof Error ? e.message : "Upload failed."),
    });
  };

  const onRemove = () => {
    setAvatarError(null);
    removeAvatar.mutate(undefined, {
      onSuccess: () => setRemoveOpen(false),
      onError: (e) => {
        setRemoveOpen(false);
        setAvatarError(
          e instanceof Error ? e.message : "Failed to remove avatar.",
        );
      },
    });
  };

  const fullName = `${user.firstName ?? ""}  ${user.lastName ?? ""}`.trim();
  const avatarUrl = assetUrl(user.avatar);

  const avatarCls =
    "!h-24 !w-24 sm:!h-28 sm:!w-28 !text-2xl font-display ring-4 ring-[var(--card)] shadow-[var(--shadow-sm)]";

  return (
    <>
      <div className={`flex items-center gap-5 ${cardCls}`}>
        <div className="relative shrink-0">
          {avatarUrl ? (
            <button
              type="button"
              onClick={() => setViewOpen(true)}
              aria-label="View profile photo"
              className="block cursor-zoom-in rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
            >
              <Avatar user={user} size="xl" className={avatarCls} />
            </button>
          ) : (
            <Avatar user={user} size="xl" className={avatarCls} />
          )}

          {updateAvatar.isPending && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold text-[var(--text-primary)]">
            {fullName}
          </h1>
          <p className="truncate text-sm text-[var(--text-secondary)]">
            {user.title || "Add a headline"}
          </p>

          <input
            ref={avatarRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatar}
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => avatarRef.current?.click()}
              className="inline-flex items-center gap-1.5 cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Camera className="h-4 w-4" />
              {avatarUrl ? "Change photo" : "Upload photo"}
            </button>

            {avatarUrl && (
              <button
                type="button"
                disabled={busy}
                onClick={() => setRemoveOpen(true)}
                className="inline-flex items-center cursor-pointer gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-500 transition-all duration-150 hover:border-red-500/40 hover:bg-red-500/20 active:scale-[0.97] active:bg-red-500/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:pointer-events-none disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            )}
          </div>

          {avatarError && (
            <p role="alert" className="mt-2 text-xs font-medium text-red-500">
              {avatarError}
            </p>
          )}
        </div>
      </div>

      {avatarUrl && (
        <>
          <Modal
            isOpen={viewOpen}
            onClose={() => setViewOpen(false)}
            title="Profile photo"
            description={fullName || undefined}
            maxWidth="max-w-2xl"
          >
            <img
              src={avatarUrl}
              alt={fullName ? `${fullName}'s avatar` : "Profile avatar"}
              className="mx-auto max-h-[65vh] w-auto max-w-full rounded-(--radius-md) object-contain"
            />
          </Modal>

          <Modal
            isOpen={removeOpen}
            onClose={() => {
              if (!removeAvatar.isPending) setRemoveOpen(false);
            }}
            title="Remove profile photo?"
            description="Your photo will be deleted and replaced with your initials."
            maxWidth="max-w-md"
          >
            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={removeAvatar.isPending}
                onClick={() => setRemoveOpen(false)}
                className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={removeAvatar.isPending}
                onClick={onRemove}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {removeAvatar.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Remove photo
              </button>
            </div>
          </Modal>
        </>
      )}
    </>
  );
}
