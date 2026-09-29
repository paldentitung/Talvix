import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Field, cardCls, iconBtn, inputCls, outlineBtn, range } from "./shared";
import type { Entry } from "./shared";
type Props = {
  heading: string;
  titleLabel: string;
  orgLabel: string;
  currentLabel: string;
  withDescription?: boolean;
  entries: Entry[];
  onSave: (entry: Entry) => void | Promise<void>;
  onDelete: (entry: Entry) => void | Promise<void>;
  busy?: boolean;
};

const blank: Entry = {
  id: "",
  title: "",
  org: "",
  start: "",
  end: null,
  description: "",
};

export default function EntryList({
  heading,
  titleLabel,
  orgLabel,
  currentLabel,
  withDescription,
  entries,
  onSave,
  onDelete,
  busy = false,
}: Props) {
  const [editing, setEditing] = useState<Entry | null>(null);
  const [error, setError] = useState("");

  const open = (e: Entry) => {
    setError("");
    setEditing(e);
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!editing) return;
    if (!editing.title.trim() || !editing.org.trim() || !editing.start)
      return setError("Fill in all required fields.");
    if (editing.end && editing.end < editing.start)
      return setError("End date can't be before the start date.");
    try {
      await onSave(editing);
      setEditing(null);
    } catch {
      /* parent already showed a toast; keep the modal open */
    }
  };

  const remove = (e: Entry) => {
    if (window.confirm(`Delete "${e.title}"?`)) onDelete(e);
  };

  return (
    <div className={cardCls}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
          {heading}
        </h3>
        <button onClick={() => open(blank)} className={outlineBtn}>
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      <div className="space-y-5">
        {entries.map((e) => (
          <div key={e.id} className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {e.title}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {e.org} · {range(e.start, e.end)}
              </p>
              {e.description && (
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {e.description}
                </p>
              )}
            </div>
            <div className="flex shrink-0">
              <button
                aria-label="Edit"
                onClick={() => open(e)}
                className={iconBtn}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                aria-label="Delete"
                disabled={busy}
                onClick={() => remove(e)}
                className={`${iconBtn} hover:!bg-[var(--danger-bg)] hover:!text-[var(--danger)] disabled:opacity-50`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        {!entries.length && (
          <p className="text-sm text-[var(--text-muted)]">
            Nothing here yet. Add your first entry.
          </p>
        )}
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--text-primary)]/40 sm:items-center sm:p-4"
          onMouseDown={(e) => e.target === e.currentTarget && setEditing(null)}
        >
          <form
            onSubmit={submit}
            className="max-h-[90vh] w-full space-y-4 overflow-y-auto rounded-t-[var(--radius-xl)] bg-[var(--card)] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[var(--shadow-lg)] sm:max-w-lg sm:rounded-[var(--radius-lg)]"
          >
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
              {editing.id
                ? `Edit ${heading.toLowerCase()}`
                : `Add ${heading.toLowerCase()}`}
            </h3>
            <Field label={titleLabel}>
              <input
                autoFocus
                className={inputCls}
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
              />
            </Field>
            <Field label={orgLabel}>
              <input
                className={inputCls}
                value={editing.org}
                onChange={(e) =>
                  setEditing({ ...editing, org: e.target.value })
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Start">
                <input
                  type="month"
                  className={inputCls}
                  value={editing.start}
                  onChange={(e) =>
                    setEditing({ ...editing, start: e.target.value })
                  }
                />
              </Field>
              <Field label="End">
                <input
                  type="month"
                  disabled={editing.end === null}
                  className={`${inputCls} disabled:opacity-50`}
                  value={editing.end ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, end: e.target.value })
                  }
                />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--primary)]"
                checked={editing.end === null}
                onChange={(e) =>
                  setEditing({ ...editing, end: e.target.checked ? null : "" })
                }
              />
              {currentLabel}
            </label>
            {withDescription && (
              <Field label="Description">
                <textarea
                  className={`${inputCls} min-h-[80px] resize-y`}
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                />
              </Field>
            )}
            {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => setEditing(null)}
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)] disabled:opacity-50"
              >
                {busy ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
