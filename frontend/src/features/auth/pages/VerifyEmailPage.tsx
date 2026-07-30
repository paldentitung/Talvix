import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  MailCheck,
  Link2,
  ExternalLink,
  Info,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import AuthLayout from "../../../components/layout/AuthLayout";
import { useVerifyEmail } from "../hooks/useVerifyEmail";

function StatusCard({
  icon,
  iconBg,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div
        className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <h1 className="font-display text-[26px] font-bold text-[var(--text-primary)] mb-2">
        {title}
      </h1>
      <p className="text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}

type VerifyState = "pending" | "success" | "error";

export default function VerifyEmailPage() {
  const [resent, setResent] = useState(false);
  const [verifyState, setVerifyState] = useState<VerifyState>("pending");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as string) || "your email";
  const { token } = useParams();
  const { mutateAsync } = useVerifyEmail();

  const hasCalledRef = useRef(false);

  useEffect(() => {
    if (!token || hasCalledRef.current) return;
    hasCalledRef.current = true;

    (async () => {
      try {
        await mutateAsync(token);
        setVerifyState("success");
      } catch (err) {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "This link is invalid or has expired.",
        );
        setVerifyState("error");
      }
    })();
  }, [token, mutateAsync]);

  useEffect(() => {
    if (verifyState !== "success") return;
    const timer = setTimeout(() => navigate("/login", { replace: true }), 3000);
    return () => clearTimeout(timer);
  }, [verifyState, navigate]);

  if (token && verifyState === "pending") {
    return (
      <AuthLayout>
        <StatusCard
          icon={
            <Loader2 className="w-7 h-7 text-[var(--primary)] animate-spin" />
          }
          iconBg="var(--primary-light)"
          title="Verifying your email"
          description="Please wait while we confirm your account."
        />
      </AuthLayout>
    );
  }

  if (token && verifyState === "success") {
    return (
      <AuthLayout>
        <StatusCard
          icon={<CheckCircle2 className="w-7 h-7 text-[var(--success)]" />}
          iconBg="var(--success-bg)"
          title="Email verified"
          description="Your account is active. Redirecting you to sign in..."
        />
      </AuthLayout>
    );
  }

  if (token && verifyState === "error") {
    return (
      <AuthLayout>
        <StatusCard
          icon={<XCircle className="w-7 h-7 text-[var(--danger)]" />}
          iconBg="var(--danger-bg)"
          title="Verification failed"
          description={errorMessage || "This link is invalid or has expired."}
        />
        <button
          type="button"
          onClick={() => setResent(true)}
          disabled={resent}
          className="w-full py-3 mt-7 rounded-[8px] bg-[var(--primary)] text-white text-sm font-semibold transition hover:bg-[var(--primary-dark)] disabled:opacity-50"
        >
          {resent ? "New link sent" : "Send a new verification link"}
        </button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-[var(--primary-light)]">
          <MailCheck className="w-7 h-7 text-[var(--primary)]" />
        </div>

        <h1 className="font-display text-[26px] font-bold text-[var(--text-primary)] mb-2">
          Verify your email
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-1">
          We sent a verification link to
        </p>
        <p className="text-sm font-semibold mb-7">{email}</p>

        <div className="p-4 rounded-lg text-left flex items-start gap-3 mb-6 bg-[var(--bg)] border border-[var(--border)]">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[var(--primary-light)]">
            <Link2 className="w-4 h-4 text-[var(--primary)]" />
          </div>
          <div>
            <p className="text-sm font-semibold">
              Open the email and click &quot;Verify email&quot;
            </p>
            <p className="text-[12.5px] text-[var(--text-muted)] mt-0.5">
              The link opens back up here and signs you in automatically. It
              expires in 30 minutes.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="w-full py-3 rounded-[8px] border border-[var(--border)] bg-white text-sm font-semibold flex items-center justify-center gap-2 mb-4 transition hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)]"
        >
          <ExternalLink className="w-4 h-4" /> Open email app
        </button>

        <div className="flex items-center justify-center gap-1.5 text-sm mb-8">
          <span className="text-[var(--text-secondary)]">
            Didn&apos;t get the email?
          </span>
          <button
            type="button"
            onClick={() => setResent(true)}
            disabled={resent}
            className="font-semibold text-[var(--primary)] hover:underline disabled:opacity-50"
          >
            {resent ? "Link sent" : "Resend link"}
          </button>
        </div>

        <div className="pt-6 text-left border-t border-[var(--border)]">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[var(--warning-bg)]">
            <Info className="w-4 h-4 mt-0.5 shrink-0 text-[var(--warning)]" />
            <p className="text-xs text-[#92400e]">
              Check your spam folder if it doesn&apos;t arrive within a couple
              of minutes.
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
