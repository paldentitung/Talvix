function VerifiedBadge({ verified }: { verified: boolean }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
      style={
        verified
          ? { background: "var(--success-bg)", color: "var(--success)" }
          : { background: "var(--warning-bg)", color: "var(--warning)" }
      }
    >
      {verified ? "Verified" : "Unverified"}
    </span>
  );
}

export default VerifiedBadge;
