import { useState } from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarVariant = "soft" | "solid";

interface AvatarProps {
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

const Avatar = ({
  src,
  name,
  initials,
  size = "md",
  variant = "soft",
  className = "",
}: AvatarProps) => {
  // Remember which src failed, so a new src gets a fresh attempt.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = !!src && src !== failedSrc;

  const base = `shrink-0 rounded-full ${sizeClasses[size]} ${className}`;

  if (showImage) {
    return (
      <img
        src={src}
        alt={name ?? ""}
        onError={() => setFailedSrc(src)}
        className={`${base} object-cover`}
      />
    );
  }

  return (
    <div
      aria-label={name}
      className={`flex items-center justify-center font-bold ${variantClasses[variant]} ${base}`}
    >
      {initials ?? getInitialsFromName(name)}
    </div>
  );
};

export default Avatar;
