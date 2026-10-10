import { SettingsCard, Toggle, type Notifications } from "./Shared";

const options: {
  key: keyof Notifications;
  label: string;
  description: string;
}[] = [
  {
    key: "newApplicants",
    label: "New applicants",
    description: "Get notified when someone applies to your jobs.",
  },
  {
    key: "jobExpiring",
    label: "Job expiring soon",
    description: "Reminder before a job posting deadline passes.",
  },
  {
    key: "weeklySummary",
    label: "Weekly summary email",
    description: "A recap of applicants, views, and pipeline activity.",
  },
  {
    key: "productUpdates",
    label: "Product updates",
    description: "News about new features and improvements.",
  },
];

type NotificationsTabProps = {
  values: Notifications;
  onChange: (key: keyof Notifications, value: boolean) => void;
};

const NotificationsTab = ({ values, onChange }: NotificationsTabProps) => (
  <SettingsCard
    title="Notifications"
    description="Choose what you want to be notified about."
  >
    <div className="mt-2 flex flex-col divide-y divide-(--border)">
      {options.map(({ key, label, description }) => (
        <Toggle
          key={key}
          checked={values[key]}
          onChange={(v) => onChange(key, v)}
          label={label}
          description={description}
        />
      ))}
    </div>
  </SettingsCard>
);

export default NotificationsTab;
