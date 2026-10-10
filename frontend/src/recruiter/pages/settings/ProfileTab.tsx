import { SettingsCard, TextField } from "./Shared";
import Button from "../../../components/ui/Button";
type ProfileTabProps = {
  firstName: string;
  lastName: string;
  phone: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
};

const ProfileTab = ({
  firstName,
  lastName,
  phone,
  onFirstNameChange,
  onLastNameChange,
  onPhoneChange,
  onSave,
  isSaving,
  isLoading,
}: ProfileTabProps) => (
  <SettingsCard
    title="Profile"
    description="Update your personal details."
    footer={
      <div className="flex items-center gap-3">
        <Button
          loading={isLoading}
          loadingText="Saving"
          onClick={onSave}
          disabled={isSaving || !firstName.trim()}
        >
          Save changes
        </Button>
      </div>
    }
  >
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <TextField
        label="First name"
        value={firstName}
        onChange={onFirstNameChange}
      />
      <TextField
        label="Last name"
        value={lastName}
        onChange={onLastNameChange}
      />
      <TextField
        label="Phone (optional)"
        value={phone}
        onChange={onPhoneChange}
        placeholder="+1 (555) 000-0000"
      />
    </div>
  </SettingsCard>
);

export default ProfileTab;
