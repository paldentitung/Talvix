import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { useCreateReport } from "../hooks/useCreateReport";
import type { ReportReason } from "../types/report.types";
import Modal from "../../../components/ui/Modal";
export type ReportTarget =
  | { type: "job"; jobId: string; label: string }
  | { type: "user"; reportedUserId: string; label: string };

type ReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  target: ReportTarget;
  onSuccess?: () => void;
};

type ReasonOption = { value: ReportReason; label: string; hint: string };

const JOB_REASONS: ReasonOption[] = [
  {
    value: "SCAM",
    label: "Scam or fraud",
    hint: "Asks for money, personal data, or looks fake.",
  },
  {
    value: "MISLEADING_INFORMATION",
    label: "Misleading information",
    hint: "Details are false, inaccurate or deceptive.",
  },
  {
    value: "INAPPROPRIATE_CONTENT",
    label: "Inappropriate content",
    hint: "Offensive, discriminatory or abusive content.",
  },
  {
    value: "SPAM",
    label: "Spam",
    hint: "Repeated, irrelevant or promotional content.",
  },
  {
    value: "OTHER",
    label: "Something else",
    hint: "Tell us what happened below.",
  },
];

const USER_REASONS: ReasonOption[] = [
  {
    value: "SCAM",
    label: "Fake profile or fraud",
    hint: "Fake identity, fake credentials, or fraudulent behavior.",
  },
  {
    value: "MISLEADING_INFORMATION",
    label: "Misleading information",
    hint: "Resume, cover letter or profile details look false.",
  },
  {
    value: "INAPPROPRIATE_CONTENT",
    label: "Inappropriate behavior",
    hint: "Harassment, offensive or abusive messages.",
  },
  { value: "SPAM", label: "Spam", hint: "Mass or irrelevant applications." },
  {
    value: "OTHER",
    label: "Something else",
    hint: "Tell us what happened below.",
  },
];
const MAX_DESCRIPTION = 500;

const ReportModal = ({
  isOpen,
  onClose,
  target,
  onSuccess,
}: ReportModalProps) => {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState("");
  const { mutate, isPending, isSuccess, isError, error, reset } =
    useCreateReport();
  const reasonOptions = target.type === "job" ? JOB_REASONS : USER_REASONS;

  const trimmed = description.trim();
  const needsDescription = reason === "OTHER";
  const canSubmit =
    !!reason && !isPending && (!needsDescription || trimmed.length > 0);

  const handleClose = () => {
    if (isPending) return;
    onClose();
    // Reset after the close so the content doesn't flash while unmounting.
    setReason(null);
    setDescription("");
    reset();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reason || !canSubmit) return;

    mutate(
      {
        reason,
        description: trimmed,
        ...(target.type === "job"
          ? { jobId: target.jobId }
          : { reportedUserId: target.reportedUserId }),
      },
      { onSuccess: () => onSuccess?.() },
    );
  };

  const subject = target.type === "job" ? "job" : "user";

  // ---- Success state ----
  if (isSuccess) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Report submitted"
        maxWidth="max-w-md"
        footer={
          <button
            onClick={handleClose}
            className="cursor-pointer rounded-full px-5 py-2 text-sm font-medium text-white"
            style={{ background: "var(--primary)" }}
          >
            Done
          </button>
        }
      >
        <div className="flex flex-col items-center py-4 text-center">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: "var(--success-bg)", color: "var(--success)" }}
          >
            <CheckCircle2 size={24} />
          </div>
          <p
            className="mt-3 text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Thanks for letting us know
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Our team will review this {subject} and take action if it breaks our
            guidelines.
          </p>
        </div>
      </Modal>
    );
  }

  // ---- Form state ----
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Report this ${subject}`}
      description={target.label}
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="cursor-pointer rounded-full border px-5 py-2 text-sm font-medium disabled:opacity-50"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="report-form"
            disabled={!canSubmit}
            className="cursor-pointer rounded-full px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: "var(--danger)" }}
          >
            {isPending ? "Submitting…" : "Submit report"}
          </button>
        </>
      }
    >
      <form id="report-form" onSubmit={handleSubmit} className="space-y-5">
        <fieldset className="space-y-2">
          <legend
            className="mb-2 text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            What's the problem?
          </legend>

          {reasonOptions.map((opt) => {
            const selected = reason === opt.value;
            return (
              <label
                key={opt.value}
                className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors"
                style={{
                  borderColor: selected ? "var(--primary)" : "var(--border)",
                  background: selected ? "var(--primary-light)" : "var(--card)",
                }}
              >
                <input
                  type="radio"
                  name="report-reason"
                  value={opt.value}
                  checked={selected}
                  onChange={() => setReason(opt.value)}
                  className="mt-0.5 accent-[var(--primary)]"
                />
                <span className="min-w-0">
                  <span
                    className="block text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {opt.label}
                  </span>
                  <span
                    className="block text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {opt.hint}
                  </span>
                </span>
              </label>
            );
          })}
        </fieldset>

        <div>
          <label
            htmlFor="report-description"
            className="mb-2 block text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Additional details{" "}
            <span
              className="font-normal"
              style={{ color: "var(--text-muted)" }}
            >
              {needsDescription ? "(required)" : "(optional)"}
            </span>
          </label>
          <textarea
            id="report-description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value.slice(0, MAX_DESCRIPTION))
            }
            rows={4}
            placeholder="Share anything that helps us review this."
            className="w-full resize-none rounded-xl border p-3 text-sm outline-none focus:ring-2"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg)",
              color: "var(--text-primary)",
            }}
          />
          <p
            className="mt-1 text-right text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            {description.length}/{MAX_DESCRIPTION}
          </p>
        </div>

        {isError && (
          <p
            className="rounded-xl px-3 py-2 text-sm"
            style={{ background: "var(--danger-bg)", color: "var(--danger)" }}
            role="alert"
          >
            {error?.message ?? "Couldn't submit your report. Please try again."}
          </p>
        )}
      </form>
    </Modal>
  );
};

export default ReportModal;
