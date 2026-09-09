export interface AvatarTint {
  bg: string;
  fg: string;
}

const AVATAR_TINTS: AvatarTint[] = [
  { bg: "#EEF2FF", fg: "#4F46E5" }, // indigo
  { bg: "#F0FDFA", fg: "#0D9488" }, // teal
  { bg: "#FDF4FF", fg: "#A21CAF" }, // fuchsia
  { bg: "#FFF7ED", fg: "#C2410C" }, // orange
  { bg: "#EFF6FF", fg: "#2563EB" }, // blue
];

export function tintFor(name: string): AvatarTint {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_TINTS[Math.abs(hash) % AVATAR_TINTS.length];
}
