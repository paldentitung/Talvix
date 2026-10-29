import { useEffect, useMemo, useState } from "react";
import { Search, Briefcase } from "lucide-react";
import { useAdminJobs } from "../../features/jobs/hooks/useAdminJobs";
import { useUpdateJobStatus } from "../../features/jobs/hooks/useUpdateJobStatus";
import { useDebouncedValue } from "../../shared/hooks/useDebouncedValue";
import Pagination from "../../shared/components/Pagination";
import RowMenu from "../../shared/components/RowMenu";
import type { Job, JobStatus } from "../../features/jobs/types/job.types";
import BottomSheet from "../../components/ui/BottomSheet";
import JobDetailView from "../../features/jobs/components/JobDetailView";
import StatusBadge from "../../shared/components/StatusBadge";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import relativeTime from "../../shared/utils/relativeTime";
const FILTERS = ["All", "OPEN", "DRAFT", "CLOSED"] as const;
type Filter = (typeof FILTERS)[number];

const FILTER_LABELS: Record<Filter, string> = {
  All: "All",
  OPEN: "Live",
  DRAFT: "Draft",
  CLOSED: "Closed",
};

const PAGE_SIZE = 10;

const AdminJobsPage = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [viewJobId, setViewJobId] = useState<string | null>(null);
  const debouncedQuery = useDebouncedValue(query).trim();
  const [jobToTakeDown, setJobToTakeDown] = useState<Job | null>(null);

  const apiFilters = useMemo(
    () => (filter !== "All" ? { status: filter as JobStatus } : undefined),
    [filter],
  );

  const { data, isLoading, isFetching, isError } = useAdminJobs(
    page,
    PAGE_SIZE,
    debouncedQuery,
    apiFilters,
  );

  const {
    mutate: updateStatus,
    isPending,
    variables: pendingVars,
  } = useUpdateJobStatus();

  const jobs: Job[] = data?.data?.jobs ?? [];
  const total = data?.data?.total ?? 0;
  const totalPages = Math.max(1, data?.data?.totalPages ?? 1);
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, filter]);
  return (
    <div onClick={() => openMenuId && setOpenMenuId(null)}>
      {/* Card */}
      <div
        className="overflow-hidden rounded-2xl border"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* Toolbar */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-b p-5"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="relative w-full max-w-xs">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs..."
              aria-label="Search jobs"
              className="w-full rounded-full border py-2.5 pl-10 pr-4 text-sm outline-none transition-shadow focus:ring-2"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  className="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
                  style={
                    active
                      ? { background: "var(--primary)", color: "#fff" }
                      : {
                          background: "var(--bg)",
                          color: "var(--text-secondary)",
                        }
                  }
                >
                  {FILTER_LABELS[f]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--text-muted)" }}
              >
                <th className="px-6 py-3.5 font-semibold">Job</th>
                <th className="px-6 py-3.5 font-semibold">Company</th>
                <th className="px-6 py-3.5 font-semibold">Applicants</th>
                <th className="px-6 py-3.5 font-semibold">Posted</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Loading jobs…
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center text-sm"
                    style={{ color: "var(--danger)" }}
                  >
                    Couldn't load jobs. Please try again.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                jobs.map((j) => (
                  <tr
                    key={j.id}
                    className="border-t transition-colors hover:bg-slate-50/70"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                          style={{
                            background: "var(--primary-light)",
                            color: "var(--primary)",
                          }}
                        >
                          <Briefcase size={16} />
                        </div>
                        <p
                          className="truncate text-sm font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {j.title}
                        </p>
                      </div>
                    </td>
                    <td
                      className="px-6 py-3.5 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {j.recruiter?.recruiterProfile?.companyName ?? "—"}
                    </td>
                    <td
                      className="px-6 py-3.5 text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {j.applicationsCount ?? 0}
                    </td>
                    <td className="px-6 py-3.5 text-sm">
                      {relativeTime(j.createdAt)}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={j.status} />
                    </td>
                    <td
                      className="px-6 py-3.5 flex justify-center items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        {/* Separate action button */}
                        {j.status !== "DRAFT" && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => setJobToTakeDown(j)}
                            variant={
                              j.status === "CLOSED" ? "primary" : "danger"
                            }
                            className="rounded-full"
                            disabled={isPending && pendingVars?.jobId === j.id}
                          >
                            {j.status === "CLOSED" ? "Reopen job" : "Take down"}
                          </Button>
                        )}

                        {/* Keep View job inside the menu */}
                        <RowMenu
                          id={j.id}
                          open={openMenuId === j.id}
                          onToggle={setOpenMenuId}
                          items={[
                            {
                              label: "View job",
                              onClick: () => {
                                setViewJobId(j.id);
                                setOpenMenuId(null);
                              },
                            },
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                ))}

              {!isLoading && !isError && jobs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      No jobs match your search
                    </p>
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Try a different title, company, or filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          total={total}
          itemLabel="jobs"
          isFetching={isFetching}
        />
        <BottomSheet
          isOpen={!!viewJobId}
          onClose={() => setViewJobId(null)}
          title="Job details"
        >
          {viewJobId && <JobDetailView key={viewJobId} id={viewJobId} />}
        </BottomSheet>

        <Modal
          isOpen={!!jobToTakeDown}
          onClose={() => {
            if (!isPending) setJobToTakeDown(null);
          }}
          title={
            jobToTakeDown?.status === "CLOSED" ? "Reopen job" : "Take down job"
          }
        >
          {jobToTakeDown && (
            <div className="space-y-5">
              {(() => {
                const isReopening = jobToTakeDown.status === "CLOSED";

                return (
                  <>
                    <p className="text-sm text-(--text-secondary)">
                      {isReopening
                        ? "Are you sure you want to reopen"
                        : "Are you sure you want to take down"}{" "}
                      <span className="font-semibold text-(--text-primary)">
                        {jobToTakeDown.title}
                      </span>
                      {isReopening
                        ? "? This will change the job status to Open."
                        : "? This will close the job posting."}
                    </p>

                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        onClick={() => setJobToTakeDown(null)}
                        disabled={isPending}
                        variant="ghost"
                        size="sm"
                      >
                        Cancel
                      </Button>

                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => {
                          updateStatus(
                            {
                              jobId: jobToTakeDown.id,
                              status: isReopening ? "OPEN" : "CLOSED",
                            },
                            {
                              onSuccess: () => setJobToTakeDown(null),
                            },
                          );
                        }}
                        disabled={isPending}
                      >
                        {isPending
                          ? isReopening
                            ? "Reopening..."
                            : "Taking down..."
                          : isReopening
                            ? "Confirm reopen"
                            : "Confirm take down"}
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminJobsPage;
