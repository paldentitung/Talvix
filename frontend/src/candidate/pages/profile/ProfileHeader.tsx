import { useRef } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRemoveAvatar } from "../../../features/users/hooks/useRemoveAvatar";
import { useUpdateAvatar } from "../../../features/users/hooks/useUpdateAvatar";

export default function ProfileHeader({ user }: { user: any }) {
  const updateAvatar = useUpdateAvatar();
  const removeAvatar = useRemoveAvatar();
  const avatarRef = useRef<HTMLInputElement>(null);
  const busy = updateAvatar.isPending || removeAvatar.isPending;

  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return void toast.error("Please select an image file");
    if (file.size > 2 * 1024 * 1024)
      return void toast.error("Image must be under 2 MB");
    updateAvatar.mutate(file);
  };

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0">
        {user.avatar ? (
          <img
            src={`${import.meta.env.VITE_API_BACKEND_URL}${user.avatar}`}
            alt=""
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary-light)] font-display text-xl font-bold text-[var(--primary)]">
            {initials}
          </div>
        )}
        <input
          ref={avatarRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onAvatar}
        />
        <button
          aria-label="Change avatar"
          disabled={busy}
          onClick={() => avatarRef.current?.click()}
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text-secondary)] shadow-[var(--shadow-sm)] hover:text-[var(--primary)] disabled:opacity-50"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        {user.avatar && (
          <button
            aria-label="Remove avatar"
            disabled={busy}
            onClick={() =>
              removeAvatar
                .mutateAsync()
                .catch((e) =>
                  toast.error(e?.message ?? "Failed to remove avatar"),
                )
            }
            className="absolute -bottom-1 -left-1 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text-secondary)] shadow-[var(--shadow-sm)] hover:text-red-500 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="min-w-0">
        <h1 className="truncate font-display text-xl font-bold text-[var(--text-primary)]">
          {user.firstName} {user.lastName}
        </h1>
        <p className="truncate text-sm text-[var(--text-secondary)]">
          {user.title || "Add a headline"}
        </p>
      </div>
    </div>
  );
}
