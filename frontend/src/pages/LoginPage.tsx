import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import AuthLayout from "../components/layout/AuthLayout";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <AuthLayout>
      <h1 className="font-display text-[26px] font-bold text-[var(--text-primary)] mb-1.5">
        Welcome back
      </h1>
      <p className="text-sm text-[var(--text-secondary)] mb-7">
        Sign in to continue to your Talvix workspace.
      </p>

      {/* Social sign-in */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-2.5 rounded-[var(--radius-sm,8px)] border border-[var(--border)] bg-white text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.85-.08-1.66-.22-2.45H12v4.63h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.87c2.27-2.09 3.56-5.17 3.56-8.8z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1C3.24 21.3 7.28 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.29c-.25-.72-.39-1.49-.39-2.29s.14-1.57.39-2.29V6.61H1.27C.46 8.24 0 10.06 0 12s.46 3.76 1.27 5.39l4-3.1z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.28 0 3.24 2.7 1.27 6.61l4 3.1C6.22 6.86 8.87 4.75 12 4.75z"
            />
          </svg>
          Google
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-[12.5px] text-[var(--text-muted)]">
          or continue with email
        </span>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setHasError(true);
        }}
      >
        <div>
          <label className="text-[13px] font-semibold text-[var(--text-primary)] mb-1.5 block">
            Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="email"
              placeholder="you@company.com"
              className="w-full bg-white border border-[var(--border)] rounded-[8px] pl-9 pr-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[13px] font-semibold text-[var(--text-primary)]">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-white border border-[var(--border)] rounded-[8px] pl-9 pr-9 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            defaultChecked
            className="w-[18px] h-[18px] rounded-[5px] border border-[var(--border)] accent-[var(--primary)]"
          />
          <span className="text-sm text-[var(--text-secondary)]">
            Keep me signed in for 30 days
          </span>
        </label>

        <button
          type="submit"
          className="w-full py-3 rounded-[8px] bg-[var(--primary)] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(79,70,229,0.18)] transition hover:bg-[var(--primary-dark)] hover:-translate-y-px"
        >
          Sign in <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <p className="text-center text-sm mt-6 text-[var(--text-secondary)]">
        New to Talvix?{" "}
        <Link
          to="/register"
          className="font-semibold text-[var(--primary)] hover:underline"
        >
          Create an account
        </Link>
      </p>

      {hasError && (
        <div className="mt-6 flex items-start gap-2.5 p-3 rounded-lg bg-[var(--danger-bg)]">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[var(--danger)]" />
          <p className="text-xs text-[#991b1b]">
            <span className="font-semibold">Incorrect email or password.</span>{" "}
            Please try again or reset your password.
          </p>
        </div>
      )}
    </AuthLayout>
  );
}
