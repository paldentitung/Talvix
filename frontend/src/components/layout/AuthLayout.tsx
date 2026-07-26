import type { ReactNode } from "react";
import Logo from "./Logo";

interface AuthLayoutProps {
  children: ReactNode;
  /** Optional width override for the centered card (default 440px) */
  maxWidth?: string;
}

export default function AuthLayout({
  children,
  maxWidth = "440px",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      <header className="px-6 sm:px-10 py-6">
        <Logo />
      </header>

      <main className="flex-1 flex items-center justify-center px-5 sm:px-10 py-6">
        <div className="w-full" style={{ maxWidth }}>
          {children}
        </div>
      </main>

      <footer className="text-center py-6 text-[12.5px] text-[var(--text-muted)]">
        © {new Date().getFullYear()} Talvix, Inc.
      </footer>
    </div>
  );
}
