import { useState, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
export type Notifications = {
  newApplicants: boolean;
  jobExpiring: boolean;
  weeklySummary: boolean;
  productUpdates: boolean;
};

export type TabId = "profile" | "notifications" | "security" | "danger";

export const SettingsCard = ({
  title,
  description,
  children,
  footer,
  danger = false,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  danger?: boolean;
}) => (
  <div
    className={`rounded-(--radius-lg) border p-5 shadow-(--shadow-sm) sm:p-6 ${
      danger
        ? "border-(--danger) bg-(--danger-bg)"
        : "border-(--border) bg-(--card)"
    }`}
  >
    <h2
      className={`font-display text-base font-bold ${
        danger ? "text-(--danger)" : "text-(--text-primary)"
      }`}
    >
      {title}
    </h2>
    <p className="mt-0.5 text-sm text-(--text-secondary)">{description}</p>

    {children}

    {footer && (
      <div className="mt-5 flex justify-end border-t border-(--border) pt-4">
        {footer}
      </div>
    )}
  </div>
);

export const TextField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  fullWidth = false,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}) => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <label
      className={`flex flex-col gap-1.5 text-sm ${fullWidth ? "sm:col-span-2" : ""}`}
    >
      <span className="font-medium text-(--text-primary)">{label}</span>

      <div className="relative">
        <input
          type={isPassword && visible ? "text" : type}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full rounded-(--radius-md) border border-(--border) bg-(--card) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--primary) ${
            isPassword ? "pr-10" : ""
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-(--text-secondary) hover:text-(--text-primary)"
          >
            {visible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </label>
  );
};

export const Toggle = ({
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
