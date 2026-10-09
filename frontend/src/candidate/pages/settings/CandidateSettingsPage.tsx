import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useGetCurrentUser } from "../../../features/users/hooks/useGetCurrentUser";
import { Card, TABS, type TabId } from "./shared";
import AccountTab from "./AccountTab";
import NotificationsTab from "./NotificationsTab";
import PrivacyTab from "./PrivacyTab";
import BillingTab from "./BillingTab";
import DangerTab from "./DangerTab";

export default function CandidateSettingsPage() {
  const { data: user, isLoading } = useGetCurrentUser();
  const [tab, setTab] = useState<TabId>("account");

  return (
    <div style={{ background: "var(--bg)" }} className="min-h-full">
      <div className=" px-2 py-2 md:px-4 md:py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          <nav className="lg:sticky lg:top-6 lg:self-start">
            <Card className="p-2">
              <ul className="flex flex-col gap-1">
                {TABS.map(({ id, label, icon: Icon }) => {
                  const active = id === tab;
                  const danger = id === "danger";
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => setTab(id)}
                        className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-sm font-medium transition-colors"
                        style={{
                          backgroundColor: active
                            ? danger
                              ? "var(--danger-bg)"
                              : "var(--primary-light)"
                            : "transparent",
                          color: danger
                            ? "var(--danger)"
                            : active
                              ? "var(--primary)"
                              : "var(--text-secondary)",
                        }}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </nav>

          <div className="flex flex-col gap-6">
            {tab === "account" &&
              (isLoading || !user ? (
                <Card className="flex items-center justify-center p-10">
                  <Loader2
                    className="h-5 w-5 animate-spin"
                    style={{ color: "var(--primary)" }}
                  />
                </Card>
              ) : (
                <AccountTab key={user.id} user={user} />
              ))}
            {tab === "notifications" && <NotificationsTab />}
            {tab === "privacy" && <PrivacyTab />}
            {tab === "billing" && <BillingTab />}
            {tab === "danger" && <DangerTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
