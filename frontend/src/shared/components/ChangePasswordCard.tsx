import { useState } from "react";
import Button from "../../components/ui/Button";
import { useChangePassword } from "../../features/users/hooks/useChangePassword";
import { SettingsCard, TextField } from "../../recruiter/pages/settings/Shared";

export default function ChangePasswordCard() {
  const { mutate: changePassword, isPending } = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mismatch = confirmPassword !== "" && newPassword !== confirmPassword;
  const canSubmit =
    currentPassword && newPassword && confirmPassword && !mismatch;

  const handleSubmit = () => {
    changePassword(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      },
    );
  };

  return (
    <SettingsCard
      title="Security"
      description="Change your password."
      footer={
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isPending || !canSubmit}
        >
          {isPending ? "Updating..." : "Update password"}
        </Button>
      }
    >
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={setCurrentPassword}
          fullWidth
        />
        <TextField
          label="New password"
          type="password"
          value={newPassword}
          onChange={setNewPassword}
        />
        <TextField
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
      </div>

      {mismatch && (
        <p className="mt-2 text-sm text-(--danger)">Passwords do not match.</p>
      )}
    </SettingsCard>
  );
}
