import { useState } from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";

export default function DangerTab() {
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const ready = confirmText.trim().toLowerCase() === "delete my account";

  const handleDelete = () => {
    if (!ready) return;
    setDeleting(true);
    // TODO: wire to the real delete-account mutation.
    setTimeout(() => setDeleting(false), 1200);
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
            Danger zone
          </h2>
          <p
            className="mt-0.5 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Permanently delete your account and all associated data.
          </p>
        </div>
      </div>

      <div
        className="mt-5 rounded-[var(--radius-md)] border bg-white p-4"
        style={{ borderColor: "var(--border)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          This deletes your profile, applications, and saved jobs. Type{" "}
          <span
            className="font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            delete my account
          </span>{" "}
          below to confirm.
        </p>
        <input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="delete my account"
          className="mt-3 w-full rounded-[10px] border px-3.5 py-2.5 text-sm outline-none focus:ring-2"
          style={
            {
              borderColor: "var(--border)",
              color: "var(--text-primary)",
              "--tw-ring-color": "var(--danger-bg)",
            } as React.CSSProperties
          }
        />
        <button
          type="button"
          disabled={!ready || deleting}
          onClick={handleDelete}
          className="mt-4 inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: "var(--danger)" }}
        >
          {deleting ? (
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
