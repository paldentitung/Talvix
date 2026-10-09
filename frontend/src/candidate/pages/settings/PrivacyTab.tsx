import { useState } from "react";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Card, SectionHeading, ToggleRow } from "./shared";

export default function PrivacyTab() {
  const [p, setP] = useState({
    profileVisible: true,
    resumeVisible: true,
    showSalary: false,
  });
  const flip = (k: keyof typeof p) => () => setP((s) => ({ ...s, [k]: !s[k] }));
  const EyeIcon = p.profileVisible ? Eye : EyeOff;

  return (
    <Card className="p-6 sm:p-7">
      <SectionHeading
        icon={ShieldCheck}
        title="Privacy"
        subtitle="Control what recruiters and companies can see."
      />
      <div className="mt-6 divide-y" style={{ borderColor: "var(--border)" }}>
        <ToggleRow
          leading={
            <EyeIcon
              className="mt-0.5 h-4 w-4"
              style={{ color: "var(--text-muted)" }}
            />
          }
          title="Public profile"
          description="Let recruiters find you in candidate search"
          checked={p.profileVisible}
          onChange={flip("profileVisible")}
        />
        <ToggleRow
          title="Resume visibility"
          description="Allow recruiters to view and download your resume"
          checked={p.resumeVisible}
          onChange={flip("resumeVisible")}
        />
        <ToggleRow
          title="Show salary expectations"
          description="Display your expected salary range on applications"
          checked={p.showSalary}
          onChange={flip("showSalary")}
        />
      </div>
    </Card>
  );
}
