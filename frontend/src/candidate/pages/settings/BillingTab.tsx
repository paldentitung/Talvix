import { CreditCard } from "lucide-react";
import { Card, SectionHeading } from "./shared";

export default function BillingTab() {
  return (
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
      <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
        No payment method on file. You'll never be charged as a candidate.
      </p>
    </Card>
  );
}
