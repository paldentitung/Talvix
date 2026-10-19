import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import type { UpdateReportStatusInput } from "../types/report.types";

export type PendingStatus = UpdateReportStatusInput["status"];

const CONFIRM_COPY: Record<
  PendingStatus,
  { title: string; description: string; confirmLabel: string; danger?: boolean }
> = {
  DISMISSED: {
    title: "Dismiss this report?",
    description:
      "The report will be closed without action. You can reopen it later if needed.",
    confirmLabel: "Dismiss",
    danger: true,
  },
  RESOLVED: {
    title: "Mark as resolved?",
    description:
      "This confirms the report was reviewed and handled. You can reopen it later if needed.",
    confirmLabel: "Resolve",
  },
  PENDING: {
    title: "Reopen this report?",
    description: "The report will go back to pending and need review again.",
    confirmLabel: "Reopen",
  },
};

type Props = {
  status: PendingStatus | null;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const ReportStatusConfirmModal = ({
  status,
  isPending,
  onConfirm,
  onClose,
}: Props) => {
  if (!status) return null;
  const copy = CONFIRM_COPY[status];

  const handleClose = () => {
    if (!isPending) onClose();
  };

  return (
    <Modal
      isOpen
      onClose={handleClose}
      title={copy.title}
      description={copy.description}
      maxWidth="max-w-sm"
      footer={
        <>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className={copy.danger ? "bg-red-500 hover:bg-red-700" : undefined}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Saving..." : copy.confirmLabel}
          </Button>
        </>
      }
    />
  );
};

export default ReportStatusConfirmModal;
