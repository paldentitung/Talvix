import { useState } from "react";
import { Bell } from "lucide-react";
import { Card, SectionHeading, ToggleRow } from "./shared";

export default function NotificationsTab() {
  const [n, setN] = useState({
    jobMatches: true,
    applicationUpdates: true,
    recruiterMessages: true,
    marketing: false,
  });
  const flip = (k: keyof typeof n) => () => setN((p) => ({ ...p, [k]: !p[k] }));

  return (
    <Card className="p-6 sm:p-7">
      <SectionHeading
        icon={Bell}
        title="Notifications"
        subtitle="Choose what you'd like to hear about."
      />
      <div className="mt-6 divide-y" style={{ borderColor: "var(--border)" }}>
        <ToggleRow
          title="Job matches"
          description="Weekly digest of jobs matching your profile"
          checked={n.jobMatches}
          onChange={flip("jobMatches")}
        />
        <ToggleRow
          title="Application updates"
          description="Get notified when your status changes"
          checked={n.applicationUpdates}
          onChange={flip("applicationUpdates")}
        />
        <ToggleRow
          title="Recruiter messages"
          description="Emails when a recruiter contacts you"
          checked={n.recruiterMessages}
          onChange={flip("recruiterMessages")}
        />
        <ToggleRow
          title="Marketing emails"
          description="Occasional tips and product updates"
          checked={n.marketing}
          onChange={flip("marketing")}
        />
      </div>
    </Card>
  );
}
