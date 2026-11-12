import { useState } from "react";
import { assetUrl } from "../utils/assetUrl";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarVariant = "soft" | "solid";

export interface AvatarUser {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null; // for objects that only have a full name
  avatar?: string | null; // relative path from the API
}

interface AvatarProps {
  user?: AvatarUser | null;
  src?: string | null;
  name?: string;
  initials?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

const variantClasses: Record<AvatarVariant, string> = {
  soft: "bg-(--primary-light) text-(--primary)",
  solid: "bg-(--primary) text-white",
};

const getInitialsFromName = (name?: string): string => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return `${first}${last}`.toUpperCase() || "?";
};

const getUserFullName = (user?: AvatarUser | null): string | undefined => {
  if (!user) return undefined;
  const full = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return full || user.name?.trim() || undefined;
};

const Avatar = ({
  user,
  src,
  name,
  initials,
  size = "md",
  variant = "soft",
  className = "",
}: AvatarProps) => {
  // Explicit props win; user fills in whatever is missing.
  const resolvedName = name ?? getUserFullName(user);
  const resolvedSrc = src ?? (user?.avatar ? assetUrl(user.avatar) : null);

  // Remember which src failed, so a new src gets a fresh attempt.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = !!resolvedSrc && resolvedSrc !== failedSrc;

  const base = `shrink-0 rounded-full ${sizeClasses[size]} ${className}`;

  if (showImage) {
    return (
      <img
        src={resolvedSrc}
        alt={resolvedName ?? ""}
        onError={() => setFailedSrc(resolvedSrc)}
        className={`${base} object-cover`}
      />
    );
  }

  return (
    <div
      aria-label={resolvedName}
      className={`flex items-center justify-center font-bold ${variantClasses[variant]} ${base}`}
    >
      {initials || getInitialsFromName(resolvedName)}
    </div>
  );
};

export default Avatar;
