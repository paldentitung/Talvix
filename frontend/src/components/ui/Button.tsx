import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "ghost" | "accent" | "dark" | "white";
type ButtonSize = "sm" | "md";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string; // renders as a router <Link to={href}>
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  type?: "button" | "submit";
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
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap transition-all duration-150 hover:-translate-y-0.5 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link to={href} className={classes}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {icon}
      {children}
    </button>
  );
}
