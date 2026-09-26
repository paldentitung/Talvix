import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import AuthLayout from "../../../components/layout/AuthLayout";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    await loginMutation.mutateAsync(formData);
  };

  const validate = () => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <AuthLayout>
      {/* Heading with a two-tone rule tying back to the logo mark */}
      <div className="mb-8">
        <h1 className="font-display text-[30px] font-bold tracking-tight text-[var(--text-primary)] mb-2 leading-tight">
          Welcome back
        </h1>
        <p className="text-[15px] text-[var(--text-secondary)] mb-3">
          Sign in to continue to your Talvix workspace.
        </p>
        <div className="flex h-[3px] w-10 rounded-full overflow-hidden">
          <div className="w-1/2 bg-[var(--primary)]" />
          <div className="w-1/2 bg-[var(--accent)]" />
        </div>
      </div>

      {/* Social sign-in — quieter than a filled button so it doesn't compete with the primary CTA */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2.5 py-2.5 mb-6 rounded-[8px] border border-[var(--border)] text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--text-muted)]"
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
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-[12px] text-[var(--text-muted)]">
          or continue with email
        </span>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="text-[13px] font-medium text-[var(--text-primary)] mb-1.5 block">
            Email
          </label>
          <div className="relative">
            <Mail className="w-[17px] h-[17px] absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-[var(--surface,white)] border border-[var(--border)] rounded-[8px] pl-9 pr-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)]"
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 flex items-center gap-1 text-[13px] text-red-600">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[13px] font-medium text-[var(--text-primary)]">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-[13px] font-medium text-[var(--primary)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-[17px] h-[17px] absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full bg-[var(--surface,white)] border border-[var(--border)] rounded-[8px] pl-9 pr-9 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-[17px] h-[17px]" />
              ) : (
                <Eye className="w-[17px] h-[17px]" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 flex items-center gap-1 text-[13px] text-red-600">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.password}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            defaultChecked
            className="w-[16px] h-[16px] rounded-[4px] border border-[var(--border)] accent-[var(--primary)]"
          />
          <span className="text-sm text-[var(--text-secondary)]">
            Keep me signed in for 30 days
          </span>
        </label>

        <button
          type="submit"
          className="group w-full py-3 rounded-[8px] bg-[var(--primary)] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-[var(--primary-dark)]"
        >
          Sign in
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
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
