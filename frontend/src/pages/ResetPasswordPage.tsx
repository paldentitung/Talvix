import { useMemo, useState } from "react";
import { ShieldCheck, Lock, Check, Circle } from "lucide-react";
import AuthLayout from "../components/layout/AuthLayout";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const checks = useMemo(
    () => ({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      numberSymbol: /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password),
    }),
    [password],
  );

  return (
    <AuthLayout>
      <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-[var(--accent-light)]">
        <ShieldCheck className="w-7 h-7 text-[var(--accent)]" />
      </div>

      <h1 className="font-display text-[26px] font-bold text-[var(--text-primary)] mb-2">
        Set a new password
      </h1>
      <p className="text-sm text-[var(--text-secondary)] mb-7">
        Choose a strong password you haven&apos;t used before.
      </p>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="text-[13px] font-semibold mb-1.5 block">
            New password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full bg-white border border-[var(--border)] rounded-[8px] pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)]"
            />
          </div>
        </div>

        <div>
          <label className="text-[13px] font-semibold mb-1.5 block">
            Confirm password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full bg-white border border-[var(--border)] rounded-[8px] pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)]"
            />
          </div>
          {confirm.length > 0 && confirm !== password && (
            <p className="text-xs text-[var(--danger)] mt-1.5">
              Passwords don&apos;t match
            </p>
          )}
        </div>

        <div className="p-4 rounded-lg space-y-2 bg-[var(--bg)] border border-[var(--border)]">
          <p className="text-xs font-semibold mb-1">Password must contain:</p>
          <Requirement met={checks.length} label="At least 8 characters" />
          <Requirement met={checks.uppercase} label="One uppercase letter" />
          <Requirement met={checks.numberSymbol} label="One number & symbol" />
        </div>

        <button
          type="submit"
          disabled={
            !checks.length ||
            !checks.uppercase ||
            !checks.numberSymbol ||
            password !== confirm
          }
          className="w-full py-3 rounded-[8px] bg-[var(--primary)] text-white text-sm font-semibold transition hover:bg-[var(--primary-dark)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Reset password
        </button>
      </form>
    </AuthLayout>
  );
}

function Requirement({ met, label }: { met: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-2 text-xs ${met ? "text-[var(--success)]" : "text-[var(--text-muted)]"}`}
    >
      {met ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <Circle className="w-3.5 h-3.5" />
      )}
      {label}
    </div>
  );
}
