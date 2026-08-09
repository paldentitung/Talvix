"use client";

import React, { useState } from "react";
import {
  User,
  Bell,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  Eye,
  EyeOff,
  Trash2,
  Loader2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type TabId = "account" | "notifications" | "privacy" | "billing" | "danger";

interface TabDef {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const TABS: TabDef[] = [
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: ShieldCheck },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "danger", label: "Danger zone", icon: AlertTriangle },
];

/* ------------------------------------------------------------------ */
/*  Small building blocks                                             */
/* ------------------------------------------------------------------ */

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        backgroundColor: checked ? "var(--primary)" : "var(--border)",
      }}
    >
      <span
        className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="mb-1.5 block text-sm font-medium"
      style={{ color: "var(--text-primary)" }}
    >
      {children}
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2"
        style={
          {
            borderColor: "var(--border)",
            color: "var(--text-primary)",
            "--tw-ring-color": "var(--primary-light)",
          } as React.CSSProperties
        }
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-[10px] border bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2"
          style={
            {
              borderColor: "var(--border)",
              color: "var(--text-primary)",
              "--tw-ring-color": "var(--primary-light)",
            } as React.CSSProperties
          }
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
          style={{ color: "var(--text-muted)" }}
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] border bg-[var(--card)] ${className}`}
      style={{ borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
    >
      {children}
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)]"
        style={{ backgroundColor: "var(--primary-light)" }}
      >
        <Icon className="h-5 w-5" style={{ color: "var(--primary)" }} />
      </div>
      <div>
        <h2
          className="font-display text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="mt-0.5 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

const CandidateSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("account");

  // Account
  const [email, setEmail] = useState("alex@hirely.com");
  const [username, setUsername] = useState("alexmorgan");
  const [language, setLanguage] = useState("English (US)");
  const [timezone, setTimezone] = useState("America/Los_Angeles");

  // Notifications
  const [notifJobMatches, setNotifJobMatches] = useState(true);
  const [notifApplicationUpdates, setNotifApplicationUpdates] = useState(true);
  const [notifRecruiterMessages, setNotifRecruiterMessages] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);

  // Privacy
  const [profileVisible, setProfileVisible] = useState(true);
  const [resumeVisible, setResumeVisible] = useState(true);
  const [showSalaryExpectations, setShowSalaryExpectations] = useState(false);

  // Danger zone
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const deleteReady = confirmText.trim().toLowerCase() === "delete my account";

  const handleDelete = () => {
    if (!deleteReady) return;
    setDeleting(true);
    // Wire this up to the real delete-account mutation.
    setTimeout(() => setDeleting(false), 1200);
  };

  const notificationItems = [
    {
      key: "jobMatches",
      title: "Job matches",
      description: "Weekly digest of jobs matching your profile",
      checked: notifJobMatches,
      onChange: () => setNotifJobMatches((v) => !v),
    },
    {
      key: "applicationUpdates",
      title: "Application updates",
      description: "Get notified when your status changes",
      checked: notifApplicationUpdates,
      onChange: () => setNotifApplicationUpdates((v) => !v),
    },
    {
      key: "recruiterMessages",
      title: "Recruiter messages",
      description: "Emails when a recruiter contacts you",
      checked: notifRecruiterMessages,
      onChange: () => setNotifRecruiterMessages((v) => !v),
    },
    {
      key: "marketing",
      title: "Marketing emails",
      description: "Occasional tips and product updates",
      checked: notifMarketing,
      onChange: () => setNotifMarketing((v) => !v),
    },
  ];

  return (
    <div style={{ background: "var(--bg)" }} className="min-h-full">
      <div className=" px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          {/* Tab nav */}
          <nav className="lg:sticky lg:top-6 lg:self-start">
            <Card className="p-2">
              <ul className="flex flex-col gap-1">
                {TABS.map((tab) => {
                  const isActive = tab.id === activeTab;
                  const isDanger = tab.id === "danger";
                  return (
                    <li key={tab.id}>
                      <button
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-sm font-medium transition-colors"
                        style={{
                          backgroundColor: isActive
                            ? isDanger
                              ? "var(--danger-bg)"
                              : "var(--primary-light)"
                            : "transparent",
                          color: isActive
                            ? isDanger
                              ? "var(--danger)"
                              : "var(--primary)"
                            : isDanger
                              ? "var(--danger)"
                              : "var(--text-secondary)",
                        }}
                      >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </nav>

          {/* Panels */}
          <div className="flex flex-col gap-6">
            {activeTab === "account" && (
              <>
                <Card className="p-6 sm:p-7">
                  <SectionHeading icon={User} title="Account" />
                  <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <TextField
                      label="Email"
                      value={email}
                      onChange={setEmail}
                      type="email"
                    />
                    <TextField
                      label="Username"
                      value={username}
                      onChange={setUsername}
                    />
                    <SelectField
                      label="Language"
                      value={language}
                      onChange={setLanguage}
                      options={[
                        "English (US)",
                        "English (UK)",
                        "Nepali",
                        "Hindi",
                        "Spanish",
                      ]}
                    />
                    <SelectField
                      label="Time zone"
                      value={timezone}
                      onChange={setTimezone}
                      options={[
                        "America/Los_Angeles",
                        "America/New_York",
                        "Asia/Kathmandu",
                        "Asia/Kolkata",
                        "Europe/London",
                      ]}
                    />
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="rounded-[10px] px-4 py-2.5 text-sm font-semibold text-white transition-colors"
                      style={{ backgroundColor: "var(--primary)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--primary-dark)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--primary)")
                      }
                    >
                      Save changes
                    </button>
                  </div>
                </Card>

                <Card className="p-6 sm:p-7">
                  <SectionHeading icon={Bell} title="Notifications" />
                  <div
                    className="mt-6 divide-y"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {notificationItems.map((item) => (
                      <div
                        key={item.key}
                        className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {item.title}
                          </p>
                          <p
                            className="mt-0.5 text-sm"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {item.description}
                          </p>
                        </div>
                        <Toggle
                          checked={item.checked}
                          onChange={item.onChange}
                          label={item.title}
                        />
                      </div>
                    ))}
                  </div>
                </Card>

                <DangerZoneCard
                  confirmText={confirmText}
                  setConfirmText={setConfirmText}
                  deleteReady={deleteReady}
                  deleting={deleting}
                  onDelete={handleDelete}
                />
              </>
            )}

            {activeTab === "notifications" && (
              <Card className="p-6 sm:p-7">
                <SectionHeading
                  icon={Bell}
                  title="Notifications"
                  subtitle="Choose what you'd like to hear about."
                />
                <div
                  className="mt-6 divide-y"
                  style={{ borderColor: "var(--border)" }}
                >
                  {notificationItems.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {item.title}
                        </p>
                        <p
                          className="mt-0.5 text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {item.description}
                        </p>
                      </div>
                      <Toggle
                        checked={item.checked}
                        onChange={item.onChange}
                        label={item.title}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "privacy" && (
              <Card className="p-6 sm:p-7">
                <SectionHeading
                  icon={ShieldCheck}
                  title="Privacy"
                  subtitle="Control what recruiters and companies can see."
                />
                <div
                  className="mt-6 divide-y"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-start justify-between gap-4 py-4 first:pt-0">
                    <div className="flex items-start gap-3">
                      {profileVisible ? (
                        <Eye
                          className="mt-0.5 h-4 w-4"
                          style={{ color: "var(--text-muted)" }}
                        />
                      ) : (
                        <EyeOff
                          className="mt-0.5 h-4 w-4"
                          style={{ color: "var(--text-muted)" }}
                        />
                      )}
                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Public profile
                        </p>
                        <p
                          className="mt-0.5 text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Let recruiters find you in candidate search
                        </p>
                      </div>
                    </div>
                    <Toggle
                      checked={profileVisible}
                      onChange={() => setProfileVisible((v) => !v)}
                      label="Public profile"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4 py-4">
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Resume visibility
                      </p>
                      <p
                        className="mt-0.5 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Allow recruiters to view and download your resume
                      </p>
                    </div>
                    <Toggle
                      checked={resumeVisible}
                      onChange={() => setResumeVisible((v) => !v)}
                      label="Resume visibility"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4 py-4 last:pb-0">
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Show salary expectations
                      </p>
                      <p
                        className="mt-0.5 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Display your expected salary range on applications
                      </p>
                    </div>
                    <Toggle
                      checked={showSalaryExpectations}
                      onChange={() => setShowSalaryExpectations((v) => !v)}
                      label="Show salary expectations"
                    />
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "billing" && (
              <Card className="p-6 sm:p-7">
                <SectionHeading
                  icon={CreditCard}
                  title="Billing"
                  subtitle="Your plan and payment details."
                />
                <div
                  className="mt-6 flex items-center justify-between rounded-[var(--radius-md)] p-5"
                  style={{ backgroundColor: "var(--accent-light)" }}
                >
                  <div>
                    <p
                      className="font-display text-base font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Free plan
                    </p>
                    <p
                      className="mt-0.5 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Job seeker accounts are always free on Hirely.
                    </p>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ backgroundColor: "var(--accent)", color: "white" }}
                  >
                    Active
                  </span>
                </div>
                <p
                  className="mt-4 text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  No payment method on file. You'll never be charged as a
                  candidate.
                </p>
              </Card>
            )}

            {activeTab === "danger" && (
              <DangerZoneCard
                confirmText={confirmText}
                setConfirmText={setConfirmText}
                deleteReady={deleteReady}
                deleting={deleting}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Danger zone (shared between Account tab bottom + Danger tab)      */
/* ------------------------------------------------------------------ */

function DangerZoneCard({
  confirmText,
  setConfirmText,
  deleteReady,
  deleting,
  onDelete,
}: {
  confirmText: string;
  setConfirmText: (v: string) => void;
  deleteReady: boolean;
  deleting: boolean;
  onDelete: () => void;
}) {
  return (
    <div
      className="rounded-[var(--radius-lg)] border p-6 sm:p-7"
      style={{
        borderColor: "var(--danger)",
        backgroundColor: "var(--danger-bg)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)]"
          style={{ backgroundColor: "white" }}
        >
          <AlertTriangle
            className="h-5 w-5"
            style={{ color: "var(--danger)" }}
          />
        </div>
        <div>
          <h2
            className="font-display text-lg font-semibold"
            style={{ color: "var(--danger)" }}
          >
            Danger zone
          </h2>
          <p
            className="mt-0.5 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Permanently delete your account and all associated data.
          </p>
        </div>
      </div>

      <div
        className="mt-5 rounded-[var(--radius-md)] border bg-white p-4"
        style={{ borderColor: "var(--border)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          This deletes your profile, applications, and saved jobs. Type{" "}
          <span
            className="font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            delete my account
          </span>{" "}
          below to confirm.
        </p>
        <input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="delete my account"
          className="mt-3 w-full rounded-[10px] border px-3.5 py-2.5 text-sm outline-none focus:ring-2"
          style={
            {
              borderColor: "var(--border)",
              color: "var(--text-primary)",
              "--tw-ring-color": "var(--danger-bg)",
            } as React.CSSProperties
          }
        />
        <button
          type="button"
          disabled={!deleteReady || deleting}
          onClick={onDelete}
          className="mt-4 inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: "var(--danger)" }}
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Delete account
        </button>
      </div>
    </div>
  );
}

export default CandidateSettingsPage;
