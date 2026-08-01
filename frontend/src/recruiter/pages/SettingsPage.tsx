import { useState } from "react";

type Notifications = {
  newApplicants: boolean;
  jobExpiring: boolean;
  weeklySummary: boolean;
  productUpdates: boolean;
};

type TabId = "profile" | "notifications" | "security" | "danger";

const tabs: { id: TabId; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "Security" },
  { id: "danger", label: "Danger zone" },
];

const Toggle = ({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description: string;
}) => (
  <div className="flex items-center justify-between gap-4 py-3">
    <div>
      <p className="text-sm font-medium text-(--text-primary)">{label}</p>
      <p className="text-xs text-(--text-secondary)">{description}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--primary) focus-visible:ring-offset-2 ${
        checked ? "bg-(--primary)" : "bg-(--border)"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-(--shadow-sm) transition-transform duration-200 ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  </div>
);

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const [name, setName] = useState("Jordan Reyes");
  const [email, setEmail] = useState("jordan@hirely.com");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [notifications, setNotifications] = useState<Notifications>({
    newApplicants: true,
    jobExpiring: true,
    weeklySummary: false,
    productUpdates: false,
  });

  const updateNotification = (key: keyof Notifications, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 overflow-x-auto border-b border-(--border) pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "border-(--primary) text-(--primary)"
                : "border-transparent text-(--text-secondary) hover:text-(--text-primary)"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) sm:p-6">
          <h2 className="font-display text-base font-bold text-(--text-primary)">
            Profile
          </h2>
          <p className="mt-0.5 text-sm text-(--text-secondary)">
            Update your personal details.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-(--text-primary)">
                Full name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-(--text-primary)">Email</span>
              <input
                type="email"
                disabled
                className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
              <span className="font-medium text-(--text-primary)">
                Phone (optional)
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
              />
            </label>
          </div>

          <div className="mt-5 flex justify-end border-t border-(--border) pt-4">
            <button className="rounded-(--radius-md) bg-(--primary) px-4 py-2 text-sm font-semibold text-white hover:bg-(--primary-dark)">
              Save changes
            </button>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) sm:p-6">
          <h2 className="font-display text-base font-bold text-(--text-primary)">
            Notifications
          </h2>
          <p className="mt-0.5 text-sm text-(--text-secondary)">
            Choose what you want to be notified about.
          </p>

          <div className="mt-2 flex flex-col divide-y divide-(--border)">
            <Toggle
              checked={notifications.newApplicants}
              onChange={(v) => updateNotification("newApplicants", v)}
              label="New applicants"
              description="Get notified when someone applies to your jobs."
            />
            <Toggle
              checked={notifications.jobExpiring}
              onChange={(v) => updateNotification("jobExpiring", v)}
              label="Job expiring soon"
              description="Reminder before a job posting deadline passes."
            />
            <Toggle
              checked={notifications.weeklySummary}
              onChange={(v) => updateNotification("weeklySummary", v)}
              label="Weekly summary email"
              description="A recap of applicants, views, and pipeline activity."
            />
            <Toggle
              checked={notifications.productUpdates}
              onChange={(v) => updateNotification("productUpdates", v)}
              label="Product updates"
              description="News about new features and improvements."
            />
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) sm:p-6">
          <h2 className="font-display text-base font-bold text-(--text-primary)">
            Security
          </h2>
          <p className="mt-0.5 text-sm text-(--text-secondary)">
            Change your password.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
              <span className="font-medium text-(--text-primary)">
                Current password
              </span>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-(--text-primary)">
                New password
              </span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-(--text-primary)">
                Confirm new password
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
              />
            </label>
          </div>

          <div className="mt-5 flex justify-end border-t border-(--border) pt-4">
            <button className="rounded-(--radius-md) bg-(--primary) px-4 py-2 text-sm font-semibold text-white hover:bg-(--primary-dark)">
              Update password
            </button>
          </div>
        </div>
      )}

      {activeTab === "danger" && (
        <div className="rounded-(--radius-lg) border border-(--danger) bg-(--danger-bg) p-5 shadow-(--shadow-sm) sm:p-6">
          <h2 className="font-display text-base font-bold text-(--danger)">
            Danger zone
          </h2>
          <p className="mt-0.5 text-sm text-(--text-secondary)">
            Deleting your account removes all your job postings and applicant
            data. This cannot be undone.
          </p>

          <div className="mt-4 flex justify-end">
            <button className="rounded-(--radius-md) border border-(--danger) bg-(--card) px-4 py-2 text-sm font-semibold text-(--danger) hover:bg-(--danger-bg)">
              Delete account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
