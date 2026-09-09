// components/ui/Pagination.tsx
import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total?: number;
  itemLabel?: string; // e.g. "jobs", "users"
  isFetching?: boolean;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  total,
  itemLabel = "items",
  isFetching = false,
}: PaginationProps) {
  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1).filter(
      (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
    );
  }, [totalPages, page]);

  if (totalPages <= 1) return null;

  return (
    <div
      className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
      style={{ borderColor: "var(--border)" }}
    >
      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
        Page {page} of {totalPages}
        {total !== undefined &&
          ` · ${total.toLocaleString()} total ${itemLabel}`}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1 || isFetching}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-40"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers.map((p, idx) => (
          <span key={p} className="flex items-center">
            {idx > 0 && pageNumbers[idx - 1] !== p - 1 && (
              <span
                className="px-1 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                …
              </span>
            )}
            <button
              onClick={() => onPageChange(p)}
              disabled={isFetching}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors"
              style={
                p === page
                  ? { background: "var(--primary)", color: "#fff" }
                  : { color: "var(--text-secondary)" }
              }
            >
              {p}
            </button>
          </span>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages || isFetching}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-40"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
