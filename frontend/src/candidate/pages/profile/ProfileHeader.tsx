import { useRef, useState } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRemoveAvatar } from "../../../features/users/hooks/useRemoveAvatar";
import { useUpdateAvatar } from "../../../features/users/hooks/useUpdateAvatar";
import Modal from "../../../components/ui/Modal";
const MAX_SIZE = 2 * 1024 * 1024;

export default function ProfileHeader({ user }: { user: any }) {
  const updateAvatar = useUpdateAvatar();
  const removeAvatar = useRemoveAvatar();
  const avatarRef = useRef<HTMLInputElement>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const busy = updateAvatar.isPending || removeAvatar.isPending;

  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return void toast.error("Please select an image file");
    if (file.size > MAX_SIZE)
      return void toast.error("Image must be under 2 MB");
    updateAvatar.mutate(file);
  };

  const onRemove = () =>
    removeAvatar
      .mutateAsync()
      .catch((e) => toast.error(e?.message ?? "Failed to remove avatar"));

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  const avatarUrl = user.avatar
    ? `${import.meta.env.VITE_API_BACKEND_URL}${user.avatar}`
    : null;

  return (
    <>
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          {avatarUrl ? (
            <button
              type="button"
              onClick={() => setViewOpen(true)}
              aria-label="View profile photo"
              className="block rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
            >
              <img
                src={avatarUrl}
                alt={fullName ? `${fullName}'s avatar` : "Profile avatar"}
                className="h-24 w-24 cursor-zoom-in rounded-full object-cover ring-4 ring-[var(--card)] shadow-[var(--shadow-sm)] sm:h-28 sm:w-28"
              />
            </button>
          ) : (
            <div
              aria-hidden="true"
              className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--primary-light)] font-display text-2xl font-bold text-[var(--primary)] ring-4 ring-[var(--card)] sm:h-28 sm:w-28"
            >
              {initials}
            </div>
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Camera className="h-4 w-4" />
              {avatarUrl ? "Change photo" : "Upload photo"}
            </button>

            {avatarUrl && (
              <button
                type="button"
                disabled={busy}
                onClick={onRemove}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-red-500/10 hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {removeAvatar.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {avatarUrl && (
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
      )}
    </>
  );
}
