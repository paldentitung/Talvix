import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserSearch,
  Building2,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import { useRegister } from "../auth/hooks/useRegister";

type Role = "seeker" | "employer";
const ROLE_MAP = {
  seeker: "CANDIDATE",
  employer: "RECRUITER",
} as const;

type FormErrors = Partial<
  Record<"firstName" | "lastName" | "email" | "password" | "terms", string>
>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("seeker");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});

  const registerMutation = useRegister();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  function validate(data: typeof formData, terms: boolean): FormErrors {
    const next: FormErrors = {};
    if (!data.firstName.trim()) next.firstName = "First name is required";
    if (!data.lastName.trim()) next.lastName = "Last name is required";
    if (!data.email.trim()) next.email = "Email is required";
    else if (!EMAIL_RE.test(data.email))
      next.email = "Enter a valid email address";
    if (!data.password) next.password = "Password is required";
    else if (data.password.length < 8)
      next.password = "Use at least 8 characters";
    if (!terms) next.terms = "You must accept the Terms and Privacy Policy";
    return next;
  }

  const updateField =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate(formData, agreedToTerms);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    await registerMutation.mutate({
      ...formData,
      role: ROLE_MAP[role],
    });

    // navigate("/verify-email", { state: formData.email });
  };

  const fieldClass = (hasError: boolean) =>
    `w-full bg-white border rounded-[8px] px-3 py-2.5 text-sm outline-none transition focus:ring-4 ${
      hasError
        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
        : "border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary-light)]"
    }`;

  return (
    <AuthLayout>
      <h1 className="font-display text-[26px] font-bold text-[var(--text-primary)] mb-1.5">
        Create your account
      </h1>
      <p className="text-sm text-[var(--text-secondary)] mb-7">
        Choose how you&apos;ll use Talvix and fill in your details.
      </p>

      {/* Role selection */}
      <div
        className="grid grid-cols-2 gap-4 mb-7"
        role="radiogroup"
        aria-label="Account type"
      >
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

      {/* Server-side error banner */}
      {registerMutation.isError && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            {(registerMutation.error as any)?.message ??
              "We couldn't create your account. Please check your details and try again."}
          </span>
        </div>
      )}

      {/* Details form */}
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="firstName"
              className="text-[13px] font-semibold mb-1.5 block"
            >
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              placeholder="Sarah"
              value={formData.firstName}
              onChange={updateField("firstName")}
              aria-invalid={!!errors.firstName}
              aria-describedby={
                errors.firstName ? "firstName-error" : undefined
              }
              className={fieldClass(!!errors.firstName)}
            />
            {errors.firstName && (
              <p id="firstName-error" className="mt-1 text-xs text-red-600">
                {errors.firstName}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="text-[13px] font-semibold mb-1.5 block"
            >
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              placeholder="Chen"
              value={formData.lastName}
              onChange={updateField("lastName")}
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              className={fieldClass(!!errors.lastName)}
            />
            {errors.lastName && (
              <p id="lastName-error" className="mt-1 text-xs text-red-600">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="text-[13px] font-semibold mb-1.5 block"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={updateField("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClass(!!errors.email)}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-[13px] font-semibold mb-1.5 block"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={updateField("password")}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`${fieldClass(!!errors.password)} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p id="password-error" className="mt-1 text-xs text-red-600">
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-start gap-2 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);
                setErrors((prev) => ({ ...prev, terms: undefined }));
              }}
              className="mt-0.5 w-[18px] h-[18px] rounded-[5px] border border-[var(--border)] accent-[var(--primary)]"
            />
            <span className="text-xs text-[var(--text-secondary)]">
              I agree to the{" "}
              <a
                href="/terms"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1 text-xs text-red-600">{errors.terms}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full rounded-[8px] bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[var(--primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {registerMutation.isPending
            ? "Creating account..."
            : "Create account"}
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
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative p-4 flex flex-col items-start gap-3 rounded-[12px] border cursor-pointer transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--primary-light)] ${
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
