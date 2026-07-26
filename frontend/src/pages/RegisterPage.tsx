import { useState } from "react";
import { Link } from "react-router-dom";
import { UserSearch, Building2, Check } from "lucide-react";
import AuthLayout from "../components/layout/AuthLayout";

type Role = "seeker" | "employer";

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("seeker");

  return (
    <AuthLayout>
      <h1 className="font-display text-[26px] font-bold text-[var(--text-primary)] mb-1.5">
        Create your account
      </h1>
      <p className="text-sm text-[var(--text-secondary)] mb-7">
        Choose how you&apos;ll use Talvix and fill in your details.
      </p>

      {/* Role selection */}
      <div className="grid grid-cols-2 gap-4 mb-7">
        <RoleCard
          icon={<UserSearch className="w-6 h-6 text-[var(--primary)]" />}
          iconBg="var(--primary-light)"
          title="Find a job"
          description="Browse roles, apply, and track your applications"
          selected={role === "seeker"}
          onClick={() => setRole("seeker")}
        />
        <RoleCard
          icon={<Building2 className="w-6 h-6 text-[var(--accent)]" />}
          iconBg="var(--accent-light)"
          title="Hire talent"
          description="Post jobs and manage applicants for your company"
          selected={role === "employer"}
          onClick={() => setRole("employer")}
        />
      </div>

      {/* Details form */}
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[13px] font-semibold mb-1.5 block">
              First name
            </label>
            <input
              placeholder="Sarah"
              className="w-full bg-white border border-[var(--border)] rounded-[8px] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)]"
            />
          </div>
          <div>
            <label className="text-[13px] font-semibold mb-1.5 block">
              Last name
            </label>
            <input
              placeholder="Chen"
              className="w-full bg-white border border-[var(--border)] rounded-[8px] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)]"
            />
          </div>
        </div>

        <div>
          <label className="text-[13px] font-semibold mb-1.5 block">
            Email
          </label>
          <input
            type="email"
            placeholder="you@company.com"
            className="w-full bg-white border border-[var(--border)] rounded-[8px] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)]"
          />
        </div>

        <div>
          <label className="text-[13px] font-semibold mb-1.5 block">
            Password
          </label>
          <input
            type="password"
            placeholder="Create a strong password"
            className="w-full bg-white border border-[var(--border)] rounded-[8px] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)]"
          />
        </div>

        <label className="flex items-start gap-2 cursor-pointer select-none pt-1">
          <input
            type="checkbox"
            defaultChecked
            className="mt-0.5 w-[18px] h-[18px] rounded-[5px] border border-[var(--border)] accent-[var(--primary)]"
          />
          <span className="text-xs text-[var(--text-secondary)]">
            I agree to the{" "}
            <a className="font-semibold text-[var(--primary)] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="font-semibold text-[var(--primary)] hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>

        <button
          type="submit"
          className="w-full py-3 rounded-[8px] bg-[var(--primary)] text-white text-sm font-semibold transition hover:bg-[var(--primary-dark)]"
        >
          Create account
        </button>
      </form>

      <p className="text-center text-sm mt-6 text-[var(--text-secondary)]">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-[var(--primary)] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

function RoleCard({
  icon,
  iconBg,
  title,
  description,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`relative p-4 flex flex-col items-start gap-3 rounded-[12px] border cursor-pointer transition hover:-translate-y-0.5 ${
        selected
          ? "border-[var(--primary)] bg-[var(--primary-light)] shadow-[0_0_0_4px_rgba(79,70,229,0.12)]"
          : "border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md"
      }`}
    >
      <div
        className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
          selected ? "bg-[var(--primary)]" : "border-2 border-[var(--border)]"
        }`}
      >
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div>
        <p className="font-semibold text-[15px] text-[var(--text-primary)]">
          {title}
        </p>
        <p className="text-[12.5px] text-[var(--text-muted)]">{description}</p>
      </div>
    </div>
  );
}
