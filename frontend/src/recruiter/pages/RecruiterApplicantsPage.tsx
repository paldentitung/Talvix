import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, UserCheck, Eye, XCircle, CheckCircle2 } from "lucide-react";
import { useRecruiterApplications } from "../../features/applications/hooks/useRecruiterApplications";
import { useUpdateApplicationStatus } from "../../features/applications/hooks/useUpdateApplicationStatus";
import { useRecruiterJobs } from "../../features/jobs/hooks/useRecruiterJobs";
import { useDebouncedValue } from "../../shared/hooks/useDebouncedValue";
import Pagination from "../../shared/components/Pagination";
import RowMenu from "../../shared/components/RowMenu";
import { fullName } from "../../shared/utils/getFullname";
import relativeTime from "../../shared/utils/relativeTime";
import type { ApplicationStatus } from "../../features/applications/types/application.types";
import toast from "react-hot-toast";
import Avatar from "../../shared/components/Avatar";
import { assetUrl } from "../../shared/utils/assetUrl";
import StatusBadge from "../../shared/components/StatusBadge";

const STATUS_FILTERS: ApplicationStatus[] = [
  "PENDING",
  "REVIEWING",
  "SHORTLISTED",
  "ACCEPTED",
  "REJECTED",
];

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  PENDING: "Pending",
  REVIEWING: "Reviewing",
  SHORTLISTED: "Shortlisted",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

const LIMIT = 10;

const AllApplicantsPage = () => {
  const [params, setParams] = useSearchParams();

  const jobId = params.get("jobId") || undefined;
  const rawStatus = params.get("status") as ApplicationStatus | null;
  const status =
    rawStatus && STATUS_FILTERS.includes(rawStatus) ? rawStatus : undefined;
  const search = params.get("search") ?? "";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const setParam = (
    patch: Record<string, string | undefined>,
    keepPage = false,
  ) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    if (!keepPage) next.delete("page");
    setParams(next, { replace: true });
  };

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebouncedValue(searchInput, 300).trim();
  useEffect(() => {
    if (debouncedSearch !== search) setParam({ search: debouncedSearch });
  }, [debouncedSearch]);

  const { data, isLoading, isFetching, isError } = useRecruiterApplications({
    page,
    limit: LIMIT,
    search,
    jobId,
    status,
  });

  const applications = data?.data.applications ?? [];
  const total = data?.data.pagination.total ?? 0;
  const totalPages = Math.max(1, data?.data.pagination.totalPages ?? 1);

  const { data: jobsData } = useRecruiterJobs(1, 100);
  const jobs: { id: string; title: string }[] = jobsData?.jobs ?? [];

  const {
    mutate: updateStatus,
    isPending,
    variables,
  } = useUpdateApplicationStatus();

  const changeStatus = (applicationId: string, next: ApplicationStatus) =>
    updateStatus(
      { applicationId, status: next },
      {
        onSuccess: () => toast.success(`Marked as ${STATUS_LABEL[next]}`),
        onError: (e) =>
          toast.error(e instanceof Error ? e.message : "Failed to update"),
      },
    );

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div onClick={() => openMenuId && setOpenMenuId(null)}>
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
          className="flex flex-col gap-3 border-b p-5"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-xs">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name or email..."
                aria-label="Search applicants"
                className="w-full rounded-full border py-2.5 pl-10 pr-4 text-sm outline-none transition-shadow focus:ring-2"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--bg)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <select
              value={jobId ?? ""}
              onChange={(e) => setParam({ jobId: e.target.value || undefined })}
              aria-label="Filter by job"
              className="rounded-full border px-4 py-2.5 text-sm outline-none"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg)",
                color: "var(--text-primary)",
              }}
            >
              <option value="">All jobs</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[undefined, ...STATUS_FILTERS].map((s) => {
              const active = status === s;
              return (
                <button
                  key={s ?? "all"}
                  onClick={() => setParam({ status: s })}
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
                  {s ? STATUS_LABEL[s] : "All"}
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
                <th className="px-6 py-3.5 font-semibold">Applicant</th>
                <th className="px-6 py-3.5 font-semibold">Applied for</th>
                <th className="px-6 py-3.5 font-semibold">Applied</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 text-center font-semibold">
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
                    Loading applicants…
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
                    Couldn't load applicants. Please try again.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                applications.map((a) => {
                  const name = fullName(a.user);
                  const busy = isPending && variables?.applicationId === a.id;
                  const resume = assetUrl(a.resumeUrl);

                  const avatarSrc = assetUrl(a.user.avatar);

                  const items = [
                    a.status !== "REVIEWING" && {
                      label: "Mark as reviewing",
                      icon: Eye,
                      onClick: () => changeStatus(a.id, "REVIEWING"),
                    },
                    a.status !== "SHORTLISTED" && {
                      label: "Shortlist",
                      icon: UserCheck,
                      onClick: () => changeStatus(a.id, "SHORTLISTED"),
                    },
                    a.status !== "ACCEPTED" && {
                      label: "Accept",
                      icon: CheckCircle2,
                      tone: "success" as const,
                      onClick: () => changeStatus(a.id, "ACCEPTED"),
                    },
                    a.status !== "REJECTED" && {
                      label: "Reject",
                      icon: XCircle,
                      tone: "danger" as const,
                      onClick: () => changeStatus(a.id, "REJECTED"),
                    },
                  ]
                    .filter(Boolean)
                    .map((item) => ({
                      ...(item as object),
                      onClick: () => {
                        (item as { onClick: () => void }).onClick();
                        setOpenMenuId(null);
                      },
                    }));

                  return (
                    <tr
                      key={a.id}
                      className="border-t transition-colors hover:bg-slate-50/70"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar src={avatarSrc} name={name} size="sm" />
                          <div className="min-w-0">
                            <p
                              className="truncate text-sm font-semibold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {name}
                            </p>
                            <p
                              className="truncate text-xs"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {a.user.candidateProfile?.title ?? a.user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td
                        className="px-6 py-3.5 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {a.job.title}
                      </td>
                      <td
                        className="px-6 py-3.5 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {relativeTime(a.appliedAt)}
                      </td>

                      <td className="px-6 py-3.5">
                        <StatusBadge status={a.status} />
                      </td>
                      <td
                        className="px-6 py-3.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {resume && (
                            <a
                              href={resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full border border-(--border) bg-(--card) px-3.5 py-1.5 text-xs font-semibold text-(--text-secondary) transition-colors hover:border-(--primary) hover:text-(--primary)"
                            >
                              Resume
                            </a>
                          )}
                          {a.status !== "WITHDRAWN" && (
                            <div
                              className={
                                busy ? "pointer-events-none opacity-50" : ""
                              }
                            >
                              <RowMenu
                                id={a.id}
                                open={openMenuId === a.id}
                                onToggle={setOpenMenuId}
                                items={items as any}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {!isLoading && !isError && applications.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      No applicants found
                    </p>
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Try a different job, status, or search.
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
          onPageChange={(p) => setParam({ page: String(p) }, true)}
          total={total}
          itemLabel="applicants"
          isFetching={isFetching}
        />
      </div>
    </div>
  );
};

export default AllApplicantsPage;
