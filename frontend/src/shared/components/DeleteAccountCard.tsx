import { useState, type CSSProperties } from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";

type DeleteAccountCardProps = {
  /** What gets deleted, e.g. "your profile, applications, and saved jobs" */
  consequences: string;
  onDelete: () => void;
  isDeleting?: boolean;
  title?: string;
  description?: string;
  confirmPhrase?: string;
};

export default function DeleteAccountCard({
  consequences,
  onDelete,
  isDeleting = false,
  title = "Danger zone",
  description = "Permanently delete your account and all associated data.",
  confirmPhrase = "delete my account",
}: DeleteAccountCardProps) {
  const [confirmText, setConfirmText] = useState("");
  const ready =
    confirmText.trim().toLowerCase() === confirmPhrase.toLowerCase();

  const handleDelete = () => {
    if (!ready || isDeleting) return;
    onDelete();
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] border p-6 sm:p-7"
      style={{
        borderColor: "var(--danger)",
        backgroundColor: "var(--danger-bg)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)]"
          style={{ backgroundColor: "white" }}
        >
          <AlertTriangle
            className="h-5 w-5"
            style={{ color: "var(--danger)" }}
          />
        </div>
        <div>
          <h2
            className="font-display text-lg font-semibold"
            style={{ color: "var(--danger)" }}
          >
            {title}
          </h2>
          <p
            className="mt-0.5 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {description}
          </p>
        </div>
      </div>

      <div
        className="mt-5 rounded-[var(--radius-md)] border bg-white p-4"
        style={{ borderColor: "var(--border)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          This deletes {consequences}. Type{" "}
          <span
            className="font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {confirmPhrase}
          </span>{" "}
          below to confirm.
        </p>
        <input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={confirmPhrase}
          className="mt-3 w-full rounded-[10px] border px-3.5 py-2.5 text-sm outline-none focus:ring-2"
          style={
            {
              borderColor: "var(--border)",
              color: "var(--text-primary)",
              "--tw-ring-color": "var(--danger-bg)",
            } as CSSProperties
          }
        />
        <button
          type="button"
          disabled={!ready || isDeleting}
          onClick={handleDelete}
          className="mt-4 inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: "var(--danger)" }}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Delete account
        </button>
      </div>
    </div>
  );
}
