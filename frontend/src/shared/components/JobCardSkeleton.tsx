export default function JobCardSkeleton() {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)] flex flex-col gap-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-[46px] h-[46px] rounded-xl bg-[var(--border)]" />
        <div className="w-8 h-8 rounded-full bg-[var(--border)]" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-4 w-3/4 rounded bg-[var(--border)]" />
        <div className="h-3 w-1/2 rounded bg-[var(--border)]" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-3 w-full rounded bg-[var(--border)]" />
        <div className="h-3 w-2/3 rounded bg-[var(--border)]" />
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="h-5 w-16 rounded-full bg-[var(--border)]" />
        <div className="h-5 w-16 rounded-full bg-[var(--border)]" />
        <div className="h-5 w-20 rounded-full bg-[var(--border)]" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
        <div className="h-4 w-24 rounded bg-[var(--border)]" />
        <div className="h-3 w-16 rounded bg-[var(--border)]" />
      </div>
    </div>
  );
}
