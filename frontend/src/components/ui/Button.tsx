import type { ReactNode, ButtonHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "ghost" | "accent" | "dark" | "white";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  type?: "button" | "submit";
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  form?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-[0_1px_2px_rgba(79,70,229,0.15)]",
  ghost:
    "bg-transparent text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)]",
  accent: "bg-[var(--accent)] text-white hover:opacity-90",
  dark: "bg-[var(--text-primary)] text-white hover:opacity-90",
  white: "bg-white text-[var(--text-primary)] hover:opacity-90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-sm rounded-[var(--radius-sm)]",
  md: "px-5 py-3 text-[14.5px] rounded-[var(--radius-md)]",
};

/**
 * Reusable across the whole app: nav actions, forms, CTAs, job card actions.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  icon,
  type = "button",
  loading = false,
  loadingText,
  disabled = false,
  form,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const classes = `inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap transition-all duration-150 hover:-translate-y-0.5 ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
    isDisabled
      ? "opacity-60 cursor-not-allowed hover:-translate-y-0 hover:opacity-60"
      : ""
  }`;

  const content = loading ? (
    <>
      <Loader2 className="w-4 h-4 animate-spin" />
      {loadingText || children}
    </>
  ) : (
    <>
      {icon}
      {children}
    </>
  );

  if (href && !isDisabled) {
    return (
      <Link to={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={isDisabled}
      className={classes}
      {...rest}
    >
      {content}
    </button>
  );
}
