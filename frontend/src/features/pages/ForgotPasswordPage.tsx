import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, KeyRound, Send, Clock, MailCheck } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import { useForgotPassword } from "../auth/hooks/useForgotPassword";
import Button from "../../components/ui/Button";
export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const forgotPasswordMutation = useForgotPassword();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Enter a valid email address" });
      return;
    }
    setErrors({});
    await forgotPasswordMutation.mutateAsync(email);
    setSent(true);
  };

  return (
    <AuthLayout>
      <Link
        to="/login"
        className="flex items-center gap-1.5 text-sm font-semibold mb-6 text-[var(--text-secondary)] w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Back to sign in
      </Link>

      {!sent ? (
        <>
          <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-[var(--primary-light)]">
            <KeyRound className="w-7 h-7 text-[var(--primary)]" />
          </div>

          <h1 className="font-display text-[26px] font-bold text-[var(--text-primary)] mb-2">
            Forgot your password?
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mb-7">
            No worries. Enter your email and we&apos;ll send a link to reset it.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-[13px] font-semibold mb-1.5 block">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[var(--border)] rounded-[8px] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)]"
              />

              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <Button
              className="w-full"
              type="submit"
              loading={forgotPasswordMutation.isPending}
              loadingText="Sending..."
            >
              Send reset link <Send className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 flex items-start gap-2.5 p-3 rounded-lg bg-[var(--warning-bg)]">
            <Clock className="w-4 h-4 mt-0.5 shrink-0 text-[var(--warning)]" />
            <p className="text-xs text-[#92400e]">
              The reset link expires in 15 minutes for your security.
            </p>
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-[var(--primary-light)]">
            <MailCheck className="w-7 h-7 text-[var(--primary)]" />
          </div>
          <h1 className="font-display text-[26px] font-bold text-[var(--text-primary)] mb-2">
            Check your inbox
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mb-1">
            We sent a reset link to
          </p>
          <p className="text-sm font-semibold mb-7">{email}</p>
          <p className="text-sm text-[var(--text-secondary)]">
            Didn&apos;t get it?{" "}
            <button
              onClick={() => setSent(false)}
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Try another email
            </button>
          </p>
        </div>
      )}
    </AuthLayout>
  );
}
