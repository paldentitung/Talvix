import { useState, type FormEvent } from "react";
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  Check,
  HelpCircle,
  Loader2,
  MessageSquareWarning,
  ShieldAlert,
  Siren,
  type LucideIcon,
} from "lucide-react";
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

type ReasonOption = {
  value: ReportReason;
  label: string;
  hint: string;
  icon: LucideIcon;
};

const JOB_REASONS: ReasonOption[] = [
  {
    value: "SCAM",
    label: "Scam or fraud",
    hint: "Asks for money, personal data, or looks fake.",
    icon: ShieldAlert,
  },
  {
    value: "MISLEADING_INFORMATION",
    label: "Misleading information",
    hint: "Details are false, inaccurate or deceptive.",
    icon: AlertCircle,
  },
  {
    value: "INAPPROPRIATE_CONTENT",
    label: "Inappropriate content",
    hint: "Offensive, discriminatory or abusive content.",
    icon: MessageSquareWarning,
  },
  {
    value: "SPAM",
    label: "Spam",
    hint: "Repeated, irrelevant or promotional content.",
    icon: Ban,
  },
  {
    value: "OTHER",
    label: "Something else",
    hint: "Tell us what happened below.",
    icon: HelpCircle,
  },
];

const USER_REASONS: ReasonOption[] = [
  {
    value: "SCAM",
    label: "Fake profile or fraud",
    hint: "Fake identity, fake credentials, or fraudulent behavior.",
    icon: ShieldAlert,
  },
  {
    value: "MISLEADING_INFORMATION",
    label: "Misleading information",
    hint: "Resume, cover letter or profile details look false.",
    icon: AlertCircle,
  },
  {
    value: "INAPPROPRIATE_CONTENT",
    label: "Inappropriate behavior",
    hint: "Harassment, offensive or abusive messages.",
    icon: MessageSquareWarning,
  },
  {
    value: "SPAM",
    label: "Spam",
    hint: "Mass or irrelevant applications.",
    icon: Ban,
  },
  {
    value: "OTHER",
    label: "Something else",
    hint: "Tell us what happened below.",
    icon: HelpCircle,
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
  const nearLimit = description.length >= MAX_DESCRIPTION * 0.9;

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
            className="w-full cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[0.98] sm:w-auto"
            style={{ background: "var(--primary)" }}
          >
            Done
          </button>
        }
      >
        <div className="flex flex-col items-center px-2 py-6 text-center">
          <div className="relative">
            <span
              className="absolute inset-0 animate-ping rounded-full opacity-30"
              style={{ background: "var(--success)" }}
            />
            <div
              className="relative flex h-16 w-16 items-center justify-center rounded-full ring-8"
              style={{
                background: "var(--success-bg)",
                color: "var(--success)",
                // @ts-expect-error CSS custom ring color
                "--tw-ring-color": "var(--success-bg)",
              }}
            >
              <CheckCircle2 size={32} strokeWidth={2} />
            </div>
          </div>
          <p
            className="mt-5 text-base font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Thanks for letting us know
          </p>
          <p
            className="mt-1.5 max-w-xs text-sm leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Our team will review this {subject} and take action if it breaks our
            guidelines.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Report this ${subject}`}
      description={target.label}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="cursor-pointer rounded-full border px-5 py-2.5 text-sm font-medium transition hover:bg-black/5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
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
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            style={{ background: "var(--danger)" }}
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Siren size={16} />
                Submit report
              </>
            )}
          </button>
        </div>
      }
    >
      <form id="report-form" onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="space-y-2.5" disabled={isPending}>
          <legend
            className="mb-3 text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            What's the problem?
          </legend>

          {reasonOptions.map((opt) => {
            const selected = reason === opt.value;
            const Icon = opt.icon;
            return (
              <label
                key={opt.value}
                className="group relative flex cursor-pointer items-center gap-3.5 rounded-2xl border p-3.5 transition-all duration-150 hover:shadow-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-1"
                style={{
                  borderColor: selected ? "var(--primary)" : "var(--border)",
                  background: selected ? "var(--primary-light)" : "var(--card)",
                  boxShadow: selected ? "0 0 0 1px var(--primary)" : undefined,
                }}
              >
                {/* Visually hidden native radio keeps keyboard + a11y behavior */}
                <input
                  type="radio"
                  name="report-reason"
                  value={opt.value}
                  checked={selected}
                  onChange={() => setReason(opt.value)}
                  className="peer sr-only"
                />

                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
                  style={{
                    background: selected ? "var(--primary)" : "var(--bg)",
                    color: selected ? "#fff" : "var(--text-muted)",
                  }}
                >
                  <Icon size={18} />
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className="block text-sm font-semibold leading-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {opt.label}
                  </span>
                  <span
                    className="mt-0.5 block text-xs leading-snug"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {opt.hint}
                  </span>
                </span>

                {/* Custom radio indicator */}
                <span
                  aria-hidden="true"
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all"
                  style={{
                    borderColor: selected ? "var(--primary)" : "var(--border)",
                    background: selected ? "var(--primary)" : "transparent",
                    color: "#fff",
                  }}
                >
                  {selected && <Check size={12} strokeWidth={3.5} />}
                </span>
              </label>
            );
          })}
        </fieldset>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="report-description"
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Additional details
            </label>
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{
                background: needsDescription ? "var(--danger-bg)" : "var(--bg)",
                color: needsDescription ? "var(--danger)" : "var(--text-muted)",
              }}
            >
              {needsDescription ? "Required" : "Optional"}
            </span>
          </div>
          <textarea
            id="report-description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value.slice(0, MAX_DESCRIPTION))
            }
            disabled={isPending}
            rows={4}
            placeholder="Share anything that helps us review this."
            className="w-full resize-none rounded-2xl border p-3.5 text-sm leading-relaxed outline-none transition-shadow placeholder:opacity-60 focus:ring-2 disabled:opacity-60"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg)",
              color: "var(--text-primary)",
            }}
          />
          <p
            className="mt-1.5 text-right text-xs tabular-nums"
            style={{
              color: nearLimit ? "var(--danger)" : "var(--text-muted)",
            }}
          >
            {description.length}/{MAX_DESCRIPTION}
          </p>
        </div>

        {isError && (
          <div
            className="flex items-start gap-2.5 rounded-2xl px-3.5 py-3 text-sm"
            style={{ background: "var(--danger-bg)", color: "var(--danger)" }}
            role="alert"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p className="leading-snug">
              {error?.message ??
                "Couldn't submit your report. Please try again."}
            </p>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default ReportModal;
