import Button from "../../../components/ui/Button";
import { SettingsCard, TextField } from "./Shared";

type SecurityTabProps = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

const SecurityTab = ({
  currentPassword,
  newPassword,
  confirmPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  isSubmitting,
}: SecurityTabProps) => {
  const mismatch = confirmPassword !== "" && newPassword !== confirmPassword;
  const canSubmit =
    currentPassword && newPassword && confirmPassword && !mismatch;

  return (
    <SettingsCard
      title="Security"
      description="Change your password."
      footer={
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={isSubmitting || !canSubmit}
        >
          {isSubmitting ? "Updating..." : "Update password"}
        </Button>
      }
    >
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={onCurrentPasswordChange}
          fullWidth
        />
        <TextField
          label="New password"
          type="password"
          value={newPassword}
          onChange={onNewPasswordChange}
        />
        <TextField
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
        />
      </div>

      {mismatch && (
        <p className="mt-2 text-sm text-(--danger)">Passwords do not match.</p>
      )}
    </SettingsCard>
  );
};

export default SecurityTab;
